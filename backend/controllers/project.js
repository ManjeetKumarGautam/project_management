import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import { io } from '../index.js'
import { Notification } from "../models/notification.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);




    // Send notifications to all assignees
    for (const m of members) {

      if (m.user != req.user._id) {

        const message = `You’ve been added to the project “${title}” by ${req.user.name}.`;

        // Save to DB
        const notification = await Notification.create({
          user: m.user,
          message,
        });

        // Emit via socket
        io.to(m.user.toString()).emit("new-notification", {
          _id: notification._id,
          message: notification.message,
          createdAt: notification.createdAt,
        });
      }
    }
    await workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('members.user', 'name profilePicture email'); // adjust fields as needed

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findOne({
      _id: project.workspace,
      members: { $elemMatch: { user: req.user._id } }, // ensure user belongs to the workspace
    })
      .select('members')
      .populate('members.user', 'name email profilePicture'); // populate workspace members

    if (!workspace) {
      return res.status(403).json({ message: "You are not part of this workspace" });
    }

    const isProjectMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isProjectMember && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied to this project" });
    }

    const projectMemberIds = project.members.map((m) => m.user._id.toString());

    const workspaceMembers = workspace.members.filter(
      (member) => !projectMemberIds.includes(member.user._id.toString())
    );

    res.status(200).json({
      project,
      workspaceMembers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate("members.user", "name profilePicture");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user?._id.toString() === req.user._id.toString() || project.createdBy.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (userId.toString() != project.createdBy.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this project." });
    }

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project deleted successfully" });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

const updateProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags } = req.body;

    const project = await Project.findById(projectId);
    console.log(project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if the user is the creator or a manager
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isManager = project.members.some(
      (member) =>
        member.user._id.toString() === req.user._id.toString() &&
        member.role === "manager"
    );

    if (!isCreator && !isManager) {
      return res.status(403).json({
        message: "You don't have permission to update this project.",
      });
    }

    const tagArray = tags ? tags.split(",") : [];

    project.title = title;
    project.description = description;
    project.status = status;
    project.startDate = startDate;
    project.dueDate = dueDate;
    project.tags = tagArray;

    project.save();


    res.status(200).json({
      message: "Project updated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { members } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to add members to this project",
      });
    }

    // Prevent duplicate users
    const existingUserIds = new Set(project.members.map((m) => m.user.toString()));
    const filteredNewMembers = members.filter(
      (m) => !existingUserIds.has(m.user)
    );

    project.members = [...project.members, ...filteredNewMembers];


    // ✅ Send notifications to all assignees
    for (const user of filteredNewMembers) {
      const message = `You’ve been added to the project: "${project.title}"`;

      // Save to DB
      const notification = await Notification.create({
        user: user.user,
        message,
      });

      // Emit via socket
      io.to(user.user.toString()).emit("new-notification", {
        _id: notification._id,
        message: notification.message,
        createdAt: notification.createdAt,
      });
    }

    await project.save();

    res.status(200).json({
      message: "New members added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export { createProject, getProjectDetails, getProjectTasks, deleteProjectById, updateProjectById, addProjectMember };

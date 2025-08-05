import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import Timeline from "@/components/project/timeline";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import moment from "moment";
import { AlertCircle, Calendar, CheckCircle, Clock, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();

  if (!projectId || !workspaceId) {
    return <div>Invalid project or workspace</div>;
  }
  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");



  const { data, isLoading, } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;

  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;

  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  const handleProjectSettings = () => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/settings`
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project?.title}</h1>
          </div>
          {project?.description && (
            <p className="text-sm text-gray-500">{project?.description}</p>
          )}
          <div className="mt-4">
            {project?.members.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Project Members :</span>

                <div className="flex space-x-2">
                  {project.members.map((member) => (
                    <Avatar
                      key={member.user?._id}
                      className="relative h-8 w-8 rounded-full  border-2 border-background overflow-hidden"
                      title={member.user?.name}
                    >
                      <AvatarImage
                        src={member.user?.profilePicture}
                        alt={member.user?.name}
                      />
                      <AvatarFallback>{member.user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-3 ">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
          <Button variant={'ghost'} className="border" onClick={() => handleProjectSettings()}> <Settings /></Button>
        </div>
      </div>

      <div className="flex items-center justify-between ">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
              <TabsTrigger value="timeline" >
                Timeline
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div className="space-x-2">
                {/* <Badge variant="outline" className="bg-violet-200">
                  {tasks.filter((task) => task.status === "Backlog").length} Backlog
                </Badge> */}
                <Badge variant="outline" className="bg-blue-200">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-orange-200">
                  {tasks.filter((task) => task.status === "In Progress").length}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-green-200">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>
          <TabsContent value="all" className="h-full">
            <div className="grid grid-cols-3 gap-3">
              {/* <div className="bg-red-50 p-4 rounded-xl">
                <TaskColumn
                  title="Backlog"
                  tasks={tasks.filter((task) => task.status === "To Do")}
                  onTaskClick={handleTaskClick}
                  projectId={projectId}
                />
              </div> */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <TaskColumn
                  title="To Do"
                  tasks={tasks.filter((task) => task.status === "To Do")}
                  onTaskClick={handleTaskClick}
                  projectId={projectId}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-xl ">
                <TaskColumn
                  title="In Progress"
                  tasks={tasks.filter((task) => task.status === "In Progress")}
                  onTaskClick={handleTaskClick}
                  projectId={projectId}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <TaskColumn
                  title="Done"
                  tasks={tasks.filter((task) => task.status === "Done")}
                  onTaskClick={handleTaskClick}
                  projectId={projectId}
                />
              </div>
            </div>
          </TabsContent>



          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
                projectId={projectId}
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
                projectId={projectId}
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-1 gap-4 ">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
                projectId={projectId}
              />
            </div>
          </TabsContent>
          {/* time line */}
          <TabsContent value="timeline" className="m-0">

            {
              tasks.length > 0 ?
                <div className=" w-[80vw] overflow-hidden border rounded-lg">
                  <Timeline tasks={tasks} />
                </div> :
                <div className="text-center text-sm text-muted-foreground">
                  No tasks yet
                </div>
            }


          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project?.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
  projectId: string
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
  projectId
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-4 ",
          !isFullWidth ? "h-full " : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <div className={`px-5 py-1 rounded-full ${title.toLowerCase() === 'to do'
              ? 'bg-[#bfdbfe] text-blue-800'
              : title.toLowerCase() === 'in progress'
                ? 'bg-[#fed7aa] text-orange-800'
                : title.toLowerCase() === 'done'
                  ? 'bg-[#bbf7d0] text-green-800'
                  : 'bg-[#fecaca] text-red-800' // e.g., for "Blocked" or any other status
              }`}>
              <h1 className="font-medium">{title}</h1>
            </div>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
                projectId={projectId}
              />
            ))
          )}
        </div>
      </div>
    </div >
  );
};

const TaskCard = ({ task, onClick, projectId }: { task: Task; onClick: () => void, projectId: string }) => {


  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleStatusClick = (taskId: string, value: string) => {
    mutate(
      { taskId, status: value as TaskStatus, projectId },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };
  return (
    <Card
      className=" flex hover:shadow-sm transition-all duration-300 hover:translate-y-1 gap-2"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge
            className={
              task.priority === "High"
                ? "bg-red-500 text-white"
                : task.priority === "Medium"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-500 text-white"
            }
          >
            {task.priority}
          </Badge>

          <div className="flex gap-1">
            {task.status !== "To Do" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={() => {
                  handleStatusClick(task._id, "To Do");
                  console.log("mark as to do");
                }}
                title="Mark as To Do"
              >
                <AlertCircle className={cn("size-4")} />
                <span className="sr-only">Mark as To Do</span>
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={() => {
                  handleStatusClick(task._id, 'In Progress');
                  console.log("mark as in progress");
                }}
                title="Mark as In Progress"
              >
                <Clock className={cn("size-4")} />
                <span className="sr-only">Mark as In Progress</span>
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={() => {
                  handleStatusClick(task._id, 'Done');
                  console.log("mark as done");
                }}
                title="Mark as Done"
              >
                <CheckCircle className={cn("size-4")} />
                <span className="sr-only">Mark as Done</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 onClick={onClick} className="text-sm hover:underline">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    + {task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="size-3 mr-1" />
              {moment(task.dueDate).format("MMMM D, YYYY")}
            </div>
          )}
        </div>
        {/* 5/10 subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>


  );
};

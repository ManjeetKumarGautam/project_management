import type { CreateProjectFormData } from "@/components/project/create-project";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-util";
import type { MemberProps, Project } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const UseCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectFormData;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.workspace],
      });
    },
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};

export const UseProjectDetailsQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}`),
  });
};


export const useDeleteProjectMutation = () => {
  return useMutation({
    mutationFn: ({ projectId }: { projectId: string }) => {
      return deleteData(`/projects/${projectId}`);
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, newData }: { projectId: string; newData: CreateProjectFormData }) => {
      return updateData(`/projects/${projectId}`, newData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ['project', data._id],
      });
    },
  });
};

export const useAddMemberProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, newData }: { projectId: string; newData: { members: { user: string; role: string }[] } }) => {
      return postData(`/projects/${projectId}`, newData);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['project', variables.projectId],
      });
    },
  });
};


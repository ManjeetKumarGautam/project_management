import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const WorkspaceAvatar = ({
  color,
  name,
}: {
  color: string;
  name: string;
}) => {
  return (
    <div
      className="w-7 h-7 rounded flex items-center justify-center"
      style={{
        backgroundColor: color,
      }}
    >
      <span className="text-lg font-medium text-white">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

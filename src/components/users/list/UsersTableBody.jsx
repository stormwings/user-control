import { UserRow } from './UserRow';

export const UsersTableBody = ({ users, startIndex = 0, onRowClick, onAction }) => {
  return (
    <tbody className="divide-y divide-gray-700 bg-gray-800">
      {users.map((user, idx) => (
        <UserRow
          key={user._id}
          user={user}
          index={startIndex + idx}
          onRowClick={onRowClick}
          onAction={onAction}
        />
      ))}
    </tbody>
  );
};

export default UsersTableBody;

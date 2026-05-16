import { Link } from "react-router";
import { getLanguageFlag } from "../lib/language";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="mb-3 flex min-w-0 items-center gap-3">
          <div className="avatar size-12 shrink-0">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="min-w-0 truncate font-semibold">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary h-auto min-h-6 whitespace-normal text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline h-auto min-h-6 whitespace-normal text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard from "../components/FriendCard";
import { getLanguageFlag } from "../lib/language";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();

  // ✅ per-user loading (FIX for flashing)
  const [sendingToId, setSendingToId] = useState(null);
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  /* -------------------- QUERIES -------------------- */

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  /* -------------------- MUTATION -------------------- */

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setSendingToId(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onSettled: () => {
      setSendingToId(null);
    },
  });

  /* -------------------- EFFECT -------------------- */

  useEffect(() => {
    const ids = new Set();
    outgoingFriendReqs.forEach((req) => {
      ids.add(req.recipient._id);
    });
    setOutgoingRequestsIds(ids);
  }, [outgoingFriendReqs]);

  /* -------------------- UI -------------------- */

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* FRIENDS HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* FRIENDS LIST */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meet New Learners
            </h2>
            <p className="opacity-70">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isSending = sendingToId === user._id;

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* USER INFO */}
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="avatar size-16 shrink-0 overflow-hidden rounded-full">
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="mt-1 flex min-w-0 items-center text-xs opacity-70">
                              <MapPinIcon className="mr-1 size-3 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary h-auto min-h-6 whitespace-normal">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline h-auto min-h-6 whitespace-normal">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="break-words text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* SEND FRIEND REQUEST */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary"
                        }`}
                        disabled={hasRequestBeenSent || isSending}
                        onClick={() => sendRequestMutation(user._id)}
                      >
                        {isSending ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2" />
                            Sending...
                          </>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to complete onboarding"));
    },
  });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    setFormState({
      ...formState,
      profilePic: `https://avatar.iran.liara.run/public/${idx}.png`,
    });
    toast.success("Random avatar generated!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  // ✅ STEP VALIDATIONS
  const isStep1Valid =
    formState.fullName.trim() !== "" && formState.profilePic !== "";

  const isStep2Valid =
    formState.bio.trim() !== "" &&
    formState.nativeLanguage !== "" &&
    formState.learningLanguage !== "";

  const isStep3Valid = formState.location.trim() !== "";

  return (
    <div className="flex min-h-[100dvh] items-start justify-center overflow-y-auto bg-base-100 px-4 py-6 sm:items-center">
      <div className="card bg-base-200 w-full max-w-xl shadow-xl">
        <div className="card-body p-6">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn btn-ghost btn-sm"
              >
                <ArrowLeftIcon className="size-5" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold">
              Complete Your Profile
            </h1>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-2 bg-base-300 rounded mb-6">
            <div
              className="h-full bg-primary rounded transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <div className="size-28 rounded-full bg-base-300 overflow-hidden">
                    {formState.profilePic ? (
                      <img
                        src={formState.profilePic}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-10 opacity-40" />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent btn-sm"
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Avatar
                  </button>
                </div>

                <div className="form-control">
                  <label className="label">Full Name *</label>
                  <input
                    className="input input-bordered"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="btn btn-primary w-full"
                >
                  Next
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="form-control">
                  <label className="label">Bio *</label>
                  <textarea
                    className="textarea textarea-bordered h-20"
                    value={formState.bio}
                    onChange={(e) =>
                      setFormState({ ...formState, bio: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    className="select select-bordered"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                  >
                    <option value="">Native Language *</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select select-bordered"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                  >
                    <option value="">Learning Language *</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="btn btn-primary w-full"
                >
                  Next
                </button>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="form-control">
                  <label className="label">Location *</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-70" />
                    <input
                      className="input input-bordered w-full pl-10"
                      value={formState.location}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isStep3Valid || isPending}
                  className="btn btn-primary w-full"
                >
                  {!isPending ? (
                    <>
                      <ShipWheelIcon className="size-5 mr-2" />
                      Complete Onboarding
                    </>
                  ) : (
                    <>
                      <LoaderIcon className="size-5 mr-2 animate-spin" />
                      Onboarding...
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

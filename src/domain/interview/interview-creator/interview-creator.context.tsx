import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useReducer,
} from "react";

const DEFAULT_CONTEXT_VALUE = {
  step: 0,
  interviewConfig: {
    selectedIndustry: "",
    selectedTopics: [""],
    yearsOfExperience: 0,
  },
};

type TInterviewCreatorValue = typeof DEFAULT_CONTEXT_VALUE;

type TInterviewCreatorContext = {
  interviewCreatorState: TInterviewCreatorValue;
  dispatchInterviewCreatorUpdate: Dispatch<TAction>;
};

const InterviewCreatorContext = createContext<TInterviewCreatorContext>({
  interviewCreatorState: DEFAULT_CONTEXT_VALUE,
} as TInterviewCreatorContext);

export const useInterviewCreator = () => useContext(InterviewCreatorContext);
type TActionType =
  | "GO_TO_NEXT_STEP"
  | "SET_STEP"
  | "SET_INDUSTRY"
  | "SET_TOPICS"
  | "SET_YEARS_OF_EXPERIENCE";
type TAction = {
  type: TActionType;
  payload?: unknown;
};

const interviewCreatorReducer = (
  prevState: TInterviewCreatorValue,
  action: TAction
): TInterviewCreatorValue => {
  const { type, payload } = action;
  switch (type) {
    case "GO_TO_NEXT_STEP":
      const nextStep = prevState.step + 1;
      console.log(nextStep);
      if (nextStep > 4) return prevState;
      return {
        ...prevState,
        step: nextStep,
      };
    case "SET_STEP":
      if (typeof payload === "number" && payload < 0) return prevState;
      return {
        ...prevState,
        step: payload as number,
      };
    case "SET_INDUSTRY":
      if (payload === undefined && typeof payload !== "string")
        return prevState;
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          selectedIndustry: payload as string,
        },
      };
    case "SET_TOPICS":
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          selectedTopics: payload as string[],
        },
      };
    case "SET_YEARS_OF_EXPERIENCE":
      if (typeof payload !== "number")
        throw new Error("yearsOfExperience should be a number");
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          yearsOfExperience: payload,
        },
      };

    default:
      return prevState;
      break;
  }
};

export const InterviewCreatorProvider = ({ children }: PropsWithChildren) => {
  const [interviewCreatorState, dispatchInterviewCreatorUpdate] = useReducer(
    interviewCreatorReducer,
    DEFAULT_CONTEXT_VALUE
  );
  const value: TInterviewCreatorContext = {
    dispatchInterviewCreatorUpdate,
    interviewCreatorState,
  };
  return (
    <InterviewCreatorContext.Provider value={value}>
      {children}
    </InterviewCreatorContext.Provider>
  );
};

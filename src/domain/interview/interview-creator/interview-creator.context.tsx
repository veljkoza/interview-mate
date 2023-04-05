import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

const DEFAULT_CONTEXT_VALUE = {
  step: 0,
  interviewConfig: {
    selectedIndustries: [""],
    selectedTopics: [""],
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
type TActionType = "GO_TO_NEXT_STEP" | "SET_STEP";
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
      if (nextStep > 1) return prevState;
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

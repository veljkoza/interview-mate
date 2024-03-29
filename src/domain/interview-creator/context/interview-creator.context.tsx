import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useReducer,
} from "react";

import { RouterInputs } from "~/utils/api";
import { Industry, Topic } from "@prisma/client";
import { STEPS_LENGTH } from "../consts/steps";

const initialInterviewConfig: RouterInputs["interview"]["create"] = {
  topics: [],
  industry: {
    id: "",
    name: "",
  },
  yearsOfExperience: -1,
  numberOfQuestions: -1,
};

const DEFAULT_CONTEXT_VALUE = {
  step: 0,
  interviewConfig: initialInterviewConfig,
  stepsArray: [] as string[],
};

type TInterviewCreatorValue = typeof DEFAULT_CONTEXT_VALUE;
export type TInterviewConfig = TInterviewCreatorValue["interviewConfig"] & {
  [k: string]: string | number | string[];
};

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
  | "SET_YEARS_OF_EXPERIENCE"
  | "SET_NUMBER_OF_QUESTIONS";
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
      if (nextStep > STEPS_LENGTH) return prevState;
      if (nextStep - 1 < prevState.stepsArray.length) {
        return {
          ...prevState,
          step: nextStep,
        };
      }
      return {
        ...prevState,
        step: nextStep,
        stepsArray: [...prevState.stepsArray, ""],
      };

    case "SET_STEP":
      if (typeof payload === "number" && payload < 0) return prevState;
      return {
        ...prevState,
        step: payload as number,
      };
    case "SET_INDUSTRY":
      if (payload === undefined || payload === null) return prevState;
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          industry: payload as Industry,
        },
      };
    case "SET_TOPICS":
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          topics: payload as Topic[],
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
    case "SET_NUMBER_OF_QUESTIONS":
      if (typeof payload !== "number")
        throw new Error("numberOfQuestions should be a number");
      return {
        ...prevState,
        interviewConfig: {
          ...prevState.interviewConfig,
          numberOfQuestions: payload,
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

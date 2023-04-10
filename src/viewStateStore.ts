import { create } from "zustand";

export type ViewStates =
  | "HOME"
  | "CONTACT"
  | "ABOUT"
  | "PROJECTS";

export type ViewState = {
  view: ViewStates;
  updateView: (to: ViewStates) => void;
};

const useViewStates = create<ViewState>()((set) => ({
  view: "HOME",
  updateView: (to) => set((state) => ({ ...state, view: to })),
}));

export { useViewStates };

import { produce } from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { Url } from "url";
import { create } from "zustand";

// this store is meant to be a website wide tracker for modal boxes. When the modalType changes a modal box will appear containing that error message. Check the AllModalBoxes component for more details
export type ModalType =
  | "server-error"
  | "successful"
  | "email-sent"
  | "login-first"
  | "auth-error"
  | "missing-feature"
  | "generic-error"
  | "generic-success"
  | null;

type State = {
  //each of the modal box types should have a default title and text attached to it that they will use if the title and the text global state is undefined. Modify the title and text only if you need to
  title: string | undefined;
  text: string | undefined;

  modalType: ModalType;
};
export type changeModalText = (params: {
  title?: string;
  text?: string;
}) => void;
export type changeModalType = (modalType: ModalType) => void;

type Actions = {
  CHANGE_MODAL_TEXT: changeModalText;
  CHANGE_MODAL_TYPE: changeModalType;
};

export const useModalStore = create<State & Actions>((set) => ({
  title: undefined,
  text: undefined,
  modalType: null,

  CHANGE_MODAL_TYPE: (modalType) =>
    set(
      produce((state: State) => {
        state.modalType = modalType;
        if (modalType === null) {
          state.text = undefined;
          state.title = undefined;
        }
      })
    ),

  CHANGE_MODAL_TEXT: ({ title, text }) =>
    set(
      produce((state: State) => {
        if (title !== undefined) state.title = title;
        if (text !== undefined) state.text = text;
      })
    ),
}));
if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("modalStore", useModalStore);
}

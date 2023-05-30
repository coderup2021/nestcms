import { HttpStatus } from 'src/interface';
import { create } from 'zustand'
import { me } from 'src/http/api/apiAuth';

interface GlobalState {
  authed: null | boolean
}

interface GlobalAction {
  fetchAuth: () => void;
  setAuthed: (auth:boolean) => void;
}

export const useGlobalStore = create<GlobalState & GlobalAction>((set) => {
  return {
    authed: null,
    async fetchAuth() {
      try {
        const { status, payload } = await me()
        if (status === HttpStatus.OK) {
          set({ authed: true })
        }
      }catch(error){
        console.log('lj error', error)
        set({authed: false})
      }
    },
    setAuthed(value:boolean){
      set({authed: value})
    }
  }
})

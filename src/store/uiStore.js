import { create } from "zustand";
import { persist } from "zustand/middleware";


const useUiStore = create(persist(
    (set, get) => ({
        showKtgTest: false,
        setShowKtgTest: () => set({ showKtgTest: !get().showKtgTest }),
    }),
      {
        name: 'ui-storage',
        getStorage: () => sessionStorage,
      }
))

export default useUiStore
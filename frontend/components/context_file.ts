import { createContext, useContext } from "react"
export type GlobalContent = {
  stop: boolean
  setStop:(c: boolean) => void
}
export const StopContext = createContext<GlobalContent>({
  stop: false, // set a default value
  setStop: () => {},
})

export const useStopContext = () => useContext(StopContext)
import { useDispatch, useSelector } from "react-redux"
import { getLanguages, translateText } from "./redux/actions/translateAction"
import "./style.scss"
import { useEffect, useMemo, useState } from "react"
import Select from 'react-select'
import { clearAnswer } from "./redux/slices/translateSlice"

function App() {
  const dispatch = useDispatch()
  const state = useSelector((store) => store.translateState)
  const [text, setText] = useState("")
  const [sourceLang, setSourceLang] = useState({
    label: "Turkish",
    value: "tr"
  })
  const [targetLang, setTargetLang] = useState({
    label: "English",
    value: "en"
  })

  const refinedData = useMemo(() => {
    return state.languages.map((i) => ({
      value: i.code,
      label: i.name
    }))
  }
    , [state.languages])

  useEffect(() => {
    dispatch(getLanguages())
  }, [])

  const handleSwap = () => {
    setTargetLang(sourceLang)
    setSourceLang(targetLang)
    setText("")
    dispatch(clearAnswer())
  }

  return (
    <div id="main-page">
      <div className="container">
        <h1>Çeviri + </h1>
        <div className="upper">
          <Select
            value={sourceLang}
            isDisabled={state.isLoading}
            onChange={setSourceLang}
            isLoading={state.isLoading}
            className="select"
            options={refinedData} />
          <button onClick={handleSwap}>
            değiş
          </button>
          <Select
            value={targetLang}
            isDisabled={state.isLoading}
            onChange={setTargetLang}
            isLoading={state.isLoading}
            className="select"
            options={refinedData} />
        </div>
        <div className="center">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="çevirmek istediğiniz yazıyı giriniz"></textarea>
          <textarea className={state.isTextLoading ? "loading" : ""} value={state.answer} disabled></textarea>
        </div>
        <button onClick={() => { dispatch(translateText({ sourceLang, targetLang, text })) }} id="translate-btn">Çevir</button>
      </div>
    </div>
  )
}

export default App

import { useState, useMemo } from 'react'
import SimulationCanvas from './SimulationCanvas.jsx'
import ControlPanel from './ControlPanel.jsx'

export default function App() {
  const [controls, setControls] = useState({
    carga: 50,
    rpm: 2000,
    g: 0,
    oleo: 50,
    diafragma: false,
    retencao: false,
    retorno: false,
    separador: false,
  })

  const [stats, setStats] = useState({ collectorMl: 0, inletMl: 0, returnMl: 0, efficiency: 90, pressao: 0 })
  const [playTrig, setPlayTrig] = useState(0)
  const [stepTrig, setStepTrig] = useState(0)
  const [resetTrig, setResetTrig] = useState(0)

  const overrun = useMemo(() => controls.rpm < 1000 || controls.retorno, [controls])

  const handleComplete = (type, dest) => {
    setStats((s) => {
      const ns = { ...s }
      if (dest === 'collector') ns.collectorMl += 1
      if (dest === 'inlet') ns.inletMl += 1
      if (dest === 'return') ns.returnMl += 1
      return ns
    })
  }

  const applyPreset = (name) => {
    const presets = {
      Lenta: { carga: 20, rpm: 800, g: 0, oleo: 50 },
      Cruzeiro: { carga: 40, rpm: 2500, g: 0, oleo: 50 },
      'Aceleração': { carga: 80, rpm: 4000, g: 0, oleo: 50 },
      'Desaceleração': { carga: 10, rpm: 1000, g: 0, oleo: 50 },
      Esportivo: { carga: 90, rpm: 6000, g: 0, oleo: 50 },
    }
    setControlsWithDerived({ ...controls, ...presets[name] })
  }

  // update pressure and efficiency
  const updateDerived = (ctrl) => {
    const pressao = (ctrl.carga * ctrl.rpm) / 10000
    const efficiency = ctrl.separador ? 50 : 90
    setStats((s) => ({ ...s, pressao, efficiency }))
  }

  const setControlsWithDerived = (ctrl) => {
    setControls(ctrl)
    updateDerived(ctrl)
  }

  return (
    <div className="w-full h-full flex flex-col max-w-[390px] mx-auto bg-gray-900 text-white">
      <div className="flex-1">
        <SimulationCanvas playTrigger={playTrig} stepTrigger={stepTrig} resetTrigger={resetTrig} overrun={overrun} onComplete={handleComplete} />
      </div>
      <ControlPanel
        controls={controls}
        setControls={setControlsWithDerived}
        stats={stats}
        onPlay={() => setPlayTrig((v) => v + 1)}
        onStep={() => setStepTrig((v) => v + 1)}
        onReset={() => {
          setStats({ collectorMl: 0, inletMl: 0, returnMl: 0, efficiency: 90, pressao: 0 })
          setResetTrig((v) => v + 1)
        }}
        applyPreset={applyPreset}
      />
    </div>
  )
}

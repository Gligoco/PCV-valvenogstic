export default function ControlPanel({ controls, setControls, stats, onPlay, onStep, onReset, applyPreset }) {
  const range = (name, label, min=0, max=100) => (
    <label className="flex flex-col text-[10px]">
      <span>{label}: {controls[name]}</span>
      <input type="range" min={min} max={max} value={controls[name]} onChange={e => setControls({ ...controls, [name]: Number(e.target.value) })} />
    </label>
  )

  const checkbox = (name, label) => (
    <label className="flex items-center text-[10px] space-x-1">
      <input type="checkbox" checked={controls[name]} onChange={e => setControls({ ...controls, [name]: e.target.checked })} />
      <span>{label}</span>
    </label>
  )

  const presets = ['Lenta', 'Cruzeiro', 'Aceleração', 'Desaceleração', 'Esportivo']

  return (
    <div className="p-2 space-y-2 bg-gray-800 text-white text-xs">
      <div className="grid grid-cols-2 gap-2">
        {range('carga', 'Carga %')}
        {range('rpm', 'RPM', 0, 8000)}
        {range('g', 'g lateral')}
        {range('oleo', 'Nível óleo')}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checkbox('diafragma', 'Diafragma vazando')}
        {checkbox('retencao', 'Retenções abertas')}
        {checkbox('retorno', 'Retorno obstruído')}
        {checkbox('separador', 'Separador ineficiente')}
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map(p => (
          <button key={p} className="px-2 py-1 bg-gray-700 rounded" onClick={() => applyPreset(p)}>{p}</button>
        ))}
      </div>
      <div className="flex gap-1">
        <button className="flex-1 bg-blue-600 rounded" onClick={onPlay}>Play</button>
        <button className="flex-1 bg-yellow-600 rounded" onClick={onStep}>Passo</button>
        <button className="flex-1 bg-red-600 rounded" onClick={onReset}>Reset</button>
      </div>
      <div className="text-[10px] space-y-1">
        <div>Pressão: {stats.pressao.toFixed(1)} kPa</div>
        <div>Válvulas: {controls.diafragma ? 'vazando' : 'ok'}</div>
        <div>ml coletor: {stats.collectorMl} | inlet: {stats.inletMl} | reservatório: {stats.returnMl}</div>
        <div>Eficiência: {stats.efficiency}%</div>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { BsShuffle, BsTrophyFill, BsArrowRepeat, BsPersonFill } from 'react-icons/bs'

const WHEEL_COLORS = [
  '#E91E86', '#F472B6', '#BE185D', '#EC4899',
  '#DB2777', '#F0ABFC', '#F9A8D4', '#FD1D7D',
  '#C026D3', '#A855F7', '#8B5CF6', '#6366F1'
]

const MAX_WHEEL_STUDENTS = 12

const Activities = () => {
  const { classes, students, universities, getStudentsByClass, getClassById } = useApp()
  const [selectedClassId, setSelectedClassId] = useState('')
  const [wheelRotation, setWheelRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [pastWinners, setPastWinners] = useState([])
  const [displayMode, setDisplayMode] = useState('wheel')
  const [cardCycleIndex, setCardCycleIndex] = useState(0)
  const [cardCycling, setCardCycling] = useState(false)
  const wheelRef = useRef(null)
  const cycleIntervalRef = useRef(null)

  const classStudents = selectedClassId ? getStudentsByClass(selectedClassId) : []
  const classData = selectedClassId ? getClassById(selectedClassId) : null
  const uni = classData ? universities.find(u => u.id === classData.universityId) : null

  const segments = classStudents.length > 0 ? classStudents : []
  const useWheel = segments.length <= MAX_WHEEL_STUDENTS

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id)
    }
  }, [classes])

  useEffect(() => {
    if (selectedClassId) {
      setWheelRotation(0)
      setWinner(null)
      setDisplayMode(useWheel ? 'wheel' : 'cards')
    }
  }, [selectedClassId, useWheel])

  useEffect(() => {
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current)
    }
  }, [])

  const handleSpin = () => {
    if (spinning || segments.length === 0) return

    if (useWheel) {
      spinWheel()
    } else {
      spinCards()
    }
  }

  const spinWheel = () => {
    setSpinning(true)
    setWinner(null)

    const winnerIndex = Math.floor(Math.random() * segments.length)
    const segmentAngle = 360 / segments.length
    const targetAngle = 360 * 5 + (360 - winnerIndex * segmentAngle - segmentAngle / 2)
    const finalRotation = wheelRotation + targetAngle

    setWheelRotation(finalRotation)

    setTimeout(() => {
      const selectedStudent = segments[winnerIndex]
      setWinner(selectedStudent)
      setShowWinnerModal(true)
      setPastWinners(prev => [selectedStudent, ...prev.slice(0, 9)])
      setSpinning(false)
    }, 4500)
  }

  const spinCards = () => {
    setSpinning(true)
    setCardCycling(true)
    setWinner(null)

    const winnerIndex = Math.floor(Math.random() * segments.length)
    let cycles = 0
    const totalCycles = 20 + Math.floor(Math.random() * 10)
    let currentSpeed = 50

    const cycle = () => {
      setCardCycleIndex(prev => (prev + 1) % segments.length)
      cycles++

      if (cycles < totalCycles) {
        currentSpeed = Math.min(currentSpeed * 1.08, 300)
        cycleIntervalRef.current = setTimeout(cycle, currentSpeed)
      } else {
        setCardCycleIndex(winnerIndex)
        setCardCycling(false)
        setTimeout(() => {
          const selectedStudent = segments[winnerIndex]
          setWinner(selectedStudent)
          setShowWinnerModal(true)
          setPastWinners(prev => [selectedStudent, ...prev.slice(0, 9)])
          setSpinning(false)
        }, 500)
      }
    }

    cycleIntervalRef.current = setTimeout(cycle, currentSpeed)
  }

  const getSegmentStyle = (index) => {
    const segmentAngle = 360 / segments.length
    const startAngle = index * segmentAngle
    const endAngle = startAngle + segmentAngle
    const midAngle = startAngle + segmentAngle / 2

    const radius = 150
    const textRadius = radius * 0.65
    const radians = (midAngle - 90) * (Math.PI / 180)
    const x = radius + textRadius * Math.cos(radians)
    const y = radius + textRadius * Math.sin(radians)

    const largeArc = segmentAngle > 180 ? 1 : 0
    const startX = radius + radius * Math.cos((startAngle - 90) * Math.PI / 180)
    const startY = radius + radius * Math.sin((startAngle - 90) * Math.PI / 180)
    const endX = radius + radius * Math.cos((endAngle - 90) * Math.PI / 180)
    const endY = radius + radius * Math.sin((endAngle - 90) * Math.PI / 180)
    const pathData = `M ${radius} ${radius} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`

    return {
      path: pathData,
      textX: x,
      textY: y,
      textAngle: midAngle,
      color: WHEEL_COLORS[index % WHEEL_COLORS.length]
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  }

  const currentCardStudent = segments[cardCycleIndex] || null

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Actividades</h2>
          <p>Selector aleatorio de participación para tus clases</p>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: 32 }}>
        <Form.Select
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
          style={{ maxWidth: 400 }}
        >
          <option value="">Seleccionar una clase...</option>
          {classes.map(cls => {
            const u = universities.find(un => un.id === cls.universityId)
            return (
              <option key={cls.id} value={cls.id}>
                {u?.icon} {cls.name} ({cls.code}) - {u?.abbreviation}
              </option>
            )
          })}
        </Form.Select>
        {segments.length > 0 && (
          <span className="badge-custom bg-info-soft ms-2" style={{ fontSize: 12 }}>
            {segments.length} alumno{segments.length !== 1 ? 's' : ''}
            {!useWheel && <span className="ms-1">• Modo tarjetas</span>}
          </span>
        )}
      </div>

      {segments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h5>No hay alumnos en esta clase</h5>
          <p>Agrega alumnos a la clase seleccionada para usar el selector</p>
        </div>
      ) : useWheel ? (
        <WheelView
          segments={segments}
          wheelRotation={wheelRotation}
          spinning={spinning}
          winner={winner}
          showWinnerModal={showWinnerModal}
          setShowWinnerModal={setShowWinnerModal}
          pastWinners={pastWinners}
          setPastWinners={setPastWinners}
          classData={classData}
          uni={uni}
          handleSpin={handleSpin}
          getSegmentStyle={getSegmentStyle}
          getInitials={getInitials}
          WHEEL_COLORS={WHEEL_COLORS}
        />
      ) : (
        <CardsView
          segments={segments}
          spinning={spinning}
          cardCycling={cardCycling}
          currentCardStudent={currentCardStudent}
          winner={winner}
          showWinnerModal={showWinnerModal}
          setShowWinnerModal={setShowWinnerModal}
          pastWinners={pastWinners}
          setPastWinners={setPastWinners}
          classData={classData}
          uni={uni}
          handleSpin={handleSpin}
          getInitials={getInitials}
          WHEEL_COLORS={WHEEL_COLORS}
        />
      )}
    </div>
  )
}

const WheelView = ({
  segments,
  wheelRotation,
  spinning,
  winner,
  showWinnerModal,
  setShowWinnerModal,
  pastWinners,
  setPastWinners,
  classData,
  uni,
  handleSpin,
  getSegmentStyle,
  getInitials,
  WHEEL_COLORS
}) => (
  <div className="custom-card" style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
    <div className="card-body-custom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="text-center mb-4">
        <h5 className="mb-1">
          {uni && <span style={{ color: uni.color }}>{uni.icon} </span>}
          {classData?.name} ({classData?.code})
        </h5>
        <p className="text-muted mb-0">{segments.length} alumno{segments.length !== 1 ? 's' : ''} en la ruleta</p>
      </div>

      <div className="wheel-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div
          className="wheel"
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '8px solid var(--primary)',
            position: 'relative',
            transform: `rotate(${wheelRotation}deg)`,
            transition: 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}
        >
          <svg width="300" height="300" viewBox="0 0 300 300">
            {segments.map((student, index) => {
              const style = getSegmentStyle(index)
              const fontSize = segments.length <= 6 ? 14 : segments.length <= 10 ? 12 : 10
              return (
                <g key={student.id}>
                  <path
                    d={style.path}
                    fill={style.color}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                  />
                  <text
                    x={style.textX}
                    y={style.textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${style.textAngle} ${style.textX} ${style.textY})`}
                    fill="#fff"
                    fontSize={fontSize}
                    fontWeight={600}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {student.name.length > 14 ? student.name.substring(0, 14) + '…' : student.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="wheel-pointer" style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '16px solid transparent',
          borderRight: '16px solid transparent',
          borderBottom: '28px solid var(--primary)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          zIndex: 10
        }} />
      </div>

      <SpinButton spinning={spinning} onClick={handleSpin} disabled={segments.length === 0} />

      {pastWinners.length > 0 && (
        <WinnersHistory pastWinners={pastWinners} setPastWinners={setPastWinners} WHEEL_COLORS={WHEEL_COLORS} />
      )}
    </div>
  </div>
)

const CardsView = ({
  segments,
  spinning,
  cardCycling,
  currentCardStudent,
  winner,
  showWinnerModal,
  setShowWinnerModal,
  pastWinners,
  setPastWinners,
  classData,
  uni,
  handleSpin,
  getInitials,
  WHEEL_COLORS
}) => (
  <div className="custom-card" style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}>
    <div className="card-body-custom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="text-center mb-4">
        <h5 className="mb-1">
          {uni && <span style={{ color: uni.color }}>{uni.icon} </span>}
          {classData?.name} ({classData?.code})
        </h5>
        <p className="text-muted mb-0">
          {segments.length} alumno{segments.length !== 1 ? 's' : ''} • Modo tarjetas para clases grandes
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, width: '100%' }}>
        <div style={{
          width: 280,
          height: 180,
          borderRadius: 'var(--radius)',
          border: '3px solid var(--border)',
          background: cardCycling ? 'linear-gradient(135deg, var(--primary)15, var(--primary-light)15)' : 'var(--bg-main)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: cardCycling ? '0 0 30px rgba(233, 30, 134, 0.2)' : 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {cardCycling && (
            <div className="shimmer-animation" style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(45deg, transparent 40%, rgba(233,30,134,0.1) 50%, transparent 60%)'
            }} />
          )}
          <BsPersonFill
            size={48}
            style={{
              color: cardCycling ? 'var(--primary)' : 'var(--text-muted)',
              marginBottom: 16,
              zIndex: 1
            }}
          />
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: cardCycling ? 'var(--primary)' : 'var(--text-primary)',
            marginBottom: 4,
            zIndex: 1,
            minHeight: 36,
            textAlign: 'center',
            width: '100%'
          }}>
            {currentCardStudent ? currentCardStudent.name : '—'}
          </h2>
          {currentCardStudent && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              zIndex: 1,
              fontFamily: 'monospace',
              margin: 0
            }}>
              Matrícula: {currentCardStudent.matricula}
            </p>
          )}
          {cardCycling && (
            <div className="pulse-animation" style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: 'var(--primary)',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              SELECCIONANDO...
            </div>
          )}
        </div>
      </div>

      <SpinButton spinning={spinning} onClick={handleSpin} disabled={segments.length === 0} text={cardCycling ? 'Seleccionando...' : 'SELECCIONAR ALUMNO'} />

      {pastWinners.length > 0 && (
        <WinnersHistory pastWinners={pastWinners} setPastWinners={setPastWinners} WHEEL_COLORS={WHEEL_COLORS} />
      )}
    </div>
  </div>
)

const SpinButton = ({ spinning, onClick, disabled, text }) => (
  <div className="text-center">
    <button
      className="btn btn-primary-custom"
      style={{
        padding: '16px 48px',
        fontSize: 18,
        fontWeight: 700,
        background: spinning ? '#94A3B8' : 'var(--primary)',
        borderColor: spinning ? '#94A3B8' : 'var(--primary)'
      }}
      onClick={onClick}
      disabled={spinning || disabled}
    >
      {spinning ? (
        <>
          <BsArrowRepeat className="me-2" style={{ animation: 'spin 1s linear infinite' }} />
          {text || 'Girando...'}
        </>
      ) : (
        <>
          <BsShuffle className="me-2" />
          {text || 'GIRAR RULETA'}
        </>
      )}
    </button>
    <style jsx>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

const WinnersHistory = ({ pastWinners, setPastWinners, WHEEL_COLORS }) => (
  <div className="mt-4 p-3" style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
    <div className="d-flex align-items-center justify-content-between mb-2">
      <h6 className="mb-0" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>
        <BsTrophyFill className="me-1" style={{ color: '#F59E0B' }} />
        Últimos seleccionados
      </h6>
      <button
        className="btn btn-sm"
        style={{ padding: '4px 12px', fontSize: 12 }}
        onClick={() => setPastWinners([])}
      >
        Limpiar
      </button>
    </div>
    <div className="d-flex flex-wrap gap-2">
      {pastWinners.map((w, i) => (
        <span
          key={`${w.id}-${i}`}
          className="badge-custom"
          style={{
            background: WHEEL_COLORS[i % WHEEL_COLORS.length] + '20',
            color: WHEEL_COLORS[i % WHEEL_COLORS.length],
            fontSize: 12
          }}
        >
          #{i + 1} {w.name}
        </span>
      ))}
    </div>
  </div>
)

const WinnerModal = ({ winner, showWinnerModal, setShowWinnerModal }) => (
  showWinnerModal && winner && (
    <Modal show={true} onHide={() => setShowWinnerModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100" style={{ color: 'var(--primary)', fontSize: 22 }}>
          <BsTrophyFill className="me-2" style={{ color: '#F59E0B' }} />
          ¡Alumno Seleccionado!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-5">
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 48,
          fontWeight: 800,
          color: '#fff',
          boxShadow: '0 10px 30px rgba(233, 30, 134, 0.4)'
        }}>
          {winner.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <h3 style={{ marginBottom: 8 }}>{winner.name}</h3>
        <p className="text-muted mb-0">Matrícula: {winner.matricula}</p>
        {winner.email && <p className="text-muted mt-1" style={{ fontSize: 13 }}>{winner.email}</p>}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary-custom" onClick={() => setShowWinnerModal(false)}>
          <BsShuffle className="me-2" /> Seleccionar otro
        </Button>
        <Button variant="secondary" onClick={() => setShowWinnerModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  )
)

export default Activities
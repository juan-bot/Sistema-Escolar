export const sampleData = {
  universities: [
    {
      id: '1',
      name: 'Universidad Autónoma de Nuevo León',
      abbreviation: 'UANL',
      color: '#059669',
      icon: '🏛️',
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Tecnológico de Monterrey',
      abbreviation: 'ITESM',
      color: '#2563EB',
      icon: '🎓',
      createdAt: '2024-01-20T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Universidad de Monterrey',
      abbreviation: 'UDEM',
      color: '#DC2626',
      icon: '📚',
      createdAt: '2024-02-01T00:00:00.000Z'
    }
  ],

  classes: [
    {
      id: '1',
      universityId: '1',
      name: 'Matemáticas Avanzadas',
      code: 'MAT-301',
      semester: '2026-1',
      schedule: 'Lun-Mié 10:00-11:30',
      classroom: 'Aula 205',
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      universityId: '1',
      name: 'Estadística Aplicada',
      code: 'EST-201',
      semester: '2026-1',
      schedule: 'Mar-Jue 14:00-15:30',
      classroom: 'Aula 102',
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '3',
      universityId: '2',
      name: 'Cálculo Diferencial',
      code: 'CAL-101',
      semester: '2026-1',
      schedule: 'Lun-Vie 8:00-9:00',
      classroom: 'Salón A3',
      createdAt: '2024-01-20T00:00:00.000Z'
    },
    {
      id: '4',
      universityId: '2',
      name: 'Álgebra Lineal',
      code: 'ALG-201',
      semester: '2026-1',
      schedule: 'Mar-Jue 10:00-11:30',
      classroom: 'Salón B1',
      createdAt: '2024-01-20T00:00:00.000Z'
    },
    {
      id: '5',
      universityId: '3',
      name: 'Probabilidad y Estadística',
      code: 'PROB-301',
      semester: '2026-1',
      schedule: 'Lun-Mié 16:00-17:30',
      classroom: 'Edificio 3, Aula 401',
      createdAt: '2024-02-01T00:00:00.000Z'
    }
  ],

  students: [
    // UANL - Matemáticas Avanzadas
    { id: '1', classId: '1', name: 'Ana García López', email: 'ana.garcia@uanl.edu.mx', matricula: 'MAT2024001', createdAt: '2024-01-16T00:00:00.000Z' },
    { id: '2', classId: '1', name: 'Carlos Rodríguez Pérez', email: 'carlos.rodriguez@uanl.edu.mx', matricula: 'MAT2024002', createdAt: '2024-01-16T00:00:00.000Z' },
    { id: '3', classId: '1', name: 'María Fernanda Torres', email: 'maria.torres@uanl.edu.mx', matricula: 'MAT2024003', createdAt: '2024-01-16T00:00:00.000Z' },
    { id: '4', classId: '1', name: 'Luis Eduardo Martínez', email: 'luis.martinez@uanl.edu.mx', matricula: 'MAT2024004', createdAt: '2024-01-16T00:00:00.000Z' },

    // UANL - Estadística
    { id: '5', classId: '2', name: 'Diego Hernández Silva', email: 'diego.hernandez@uanl.edu.mx', matricula: 'EST2024001', createdAt: '2024-01-16T00:00:00.000Z' },
    { id: '6', classId: '2', name: 'Sofía Martínez Ruiz', email: 'sofia.martinez@uanl.edu.mx', matricula: 'EST2024002', createdAt: '2024-01-16T00:00:00.000Z' },
    { id: '7', classId: '2', name: 'Andrea Vega Castillo', email: 'andrea.vega@uanl.edu.mx', matricula: 'EST2024003', createdAt: '2024-01-16T00:00:00.000Z' },

    // ITESM - Cálculo Diferencial
    { id: '8', classId: '3', name: 'Roberto Sánchez Villa', email: 'roberto.sanchez@itesm.mx', matricula: 'A01234567', createdAt: '2024-01-21T00:00:00.000Z' },
    { id: '9', classId: '3', name: 'Valentina Cruz Mendoza', email: 'valentina.cruz@itesm.mx', matricula: 'A01234568', createdAt: '2024-01-21T00:00:00.000Z' },
    { id: '10', classId: '3', name: 'Andrés López Castillo', email: 'andres.lopez@itesm.mx', matricula: 'A01234569', createdAt: '2024-01-21T00:00:00.000Z' },
    { id: '11', classId: '3', name: 'Isabella Ramírez Ortiz', email: 'isabella.ramirez@itesm.mx', matricula: 'A01234570', createdAt: '2024-01-21T00:00:00.000Z' },

    // ITESM - Álgebra Lineal
    { id: '12', classId: '4', name: 'Fernando Díaz Moreno', email: 'fernando.diaz@itesm.mx', matricula: 'A01234571', createdAt: '2024-01-21T00:00:00.000Z' },
    { id: '13', classId: '4', name: 'Camila Vargas Ríos', email: 'camila.vargas@itesm.mx', matricula: 'A01234572', createdAt: '2024-01-21T00:00:00.000Z' },
    { id: '14', classId: '4', name: 'Emiliano Rojas Gutiérrez', email: 'emiliano.rojas@itesm.mx', matricula: 'A01234573', createdAt: '2024-01-21T00:00:00.000Z' },

    // UDEM - Probabilidad
    { id: '15', classId: '5', name: 'Emilio Gutiérrez Flores', email: 'emilio.gutierrez@udem.edu.mx', matricula: 'PRB2024001', createdAt: '2024-02-02T00:00:00.000Z' },
    { id: '16', classId: '5', name: 'Lucía Mendoza Ávila', email: 'lucia.mendoza@udem.edu.mx', matricula: 'PRB2024002', createdAt: '2024-02-02T00:00:00.000Z' },
    { id: '17', classId: '5', name: 'Santiago Navarro Peña', email: 'santiago.navarro@udem.edu.mx', matricula: 'PRB2024003', createdAt: '2024-02-02T00:00:00.000Z' },
    { id: '18', classId: '5', name: 'Regina Delgado Luna', email: 'regina.delgado@udem.edu.mx', matricula: 'PRB2024004', createdAt: '2024-02-02T00:00:00.000Z' }
  ],

  rubrics: [
    {
      id: '1',
      classId: '1',
      name: 'Evaluación Parcial 1',
      criteria: [
        { id: 'c1', name: 'Examen Teórico', description: 'Evaluación escrita de conceptos fundamentales', maxScore: 10, weight: 40 },
        { id: 'c2', name: 'Tareas y Ejercicios', description: 'Ejercicios y problemas asignados semanalmente', maxScore: 10, weight: 20 },
        { id: 'c3', name: 'Proyecto Integrador', description: 'Proyecto de aplicación práctica en equipo', maxScore: 10, weight: 25 },
        { id: 'c4', name: 'Participación', description: 'Participación activa y asistencia a clase', maxScore: 10, weight: 15 }
      ],
      createdAt: '2024-01-20T00:00:00.000Z'
    },
    {
      id: '2',
      classId: '3',
      name: 'Evaluación Continua',
      criteria: [
        { id: 'c5', name: 'Quizzes Semanales', description: 'Evaluaciones rápidas cada semana', maxScore: 10, weight: 30 },
        { id: 'c6', name: 'Prácticas de Laboratorio', description: 'Ejercicios prácticos en laboratorio', maxScore: 10, weight: 30 },
        { id: 'c7', name: 'Examen Final', description: 'Evaluación final comprensiva del curso', maxScore: 10, weight: 40 }
      ],
      createdAt: '2024-01-25T00:00:00.000Z'
    },
    {
      id: '3',
      classId: '5',
      name: 'Evaluación Semestral',
      criteria: [
        { id: 'c8', name: 'Exámenes Parciales', description: 'Promedio de exámenes parciales', maxScore: 10, weight: 35 },
        { id: 'c9', name: 'Trabajo Final', description: 'Investigación y presentación final', maxScore: 10, weight: 30 },
        { id: 'c10', name: 'Tareas', description: 'Entregas semanales de ejercicios', maxScore: 10, weight: 20 },
        { id: 'c11', name: 'Asistencia y Participación', description: 'Asistencia regular y participación activa', maxScore: 10, weight: 15 }
      ],
      createdAt: '2024-02-05T00:00:00.000Z'
    }
  ],

  grades: []
}

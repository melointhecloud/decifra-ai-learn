export interface Question {
  id: string;
  question_text: string;
  alternatives: { id: string; text: string }[];
  correct_answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export const diagnosticQuestions: Question[] = [
  // Álgebra básica (5 questions)
  {
    id: '1',
    question_text: 'Resolva a equação: 2x + 5 = 13',
    alternatives: [
      { id: 'A', text: 'x = 3' },
      { id: 'B', text: 'x = 4' },
      { id: 'C', text: 'x = 5' },
      { id: 'D', text: 'x = 6' }
    ],
    correct_answer: 'B',
    topic: 'Álgebra básica',
    difficulty: 'easy',
    explanation: '2x + 5 = 13, então 2x = 8, logo x = 4'
  },
  {
    id: '2',
    question_text: 'Qual é o valor de x na equação: 3x - 7 = 2x + 5?',
    alternatives: [
      { id: 'A', text: 'x = 10' },
      { id: 'B', text: 'x = 11' },
      { id: 'C', text: 'x = 12' },
      { id: 'D', text: 'x = 13' }
    ],
    correct_answer: 'C',
    topic: 'Álgebra básica',
    difficulty: 'medium',
    explanation: '3x - 2x = 5 + 7, então x = 12'
  },
  {
    id: '3',
    question_text: 'Simplifique: 4(x + 2) - 2(x - 1)',
    alternatives: [
      { id: 'A', text: '2x + 10' },
      { id: 'B', text: '2x + 6' },
      { id: 'C', text: '6x + 6' },
      { id: 'D', text: '2x + 8' }
    ],
    correct_answer: 'A',
    topic: 'Álgebra básica',
    difficulty: 'medium',
    explanation: '4x + 8 - 2x + 2 = 2x + 10'
  },
  {
    id: '4',
    question_text: 'Se x² = 49, quais são os possíveis valores de x?',
    alternatives: [
      { id: 'A', text: 'x = 7 apenas' },
      { id: 'B', text: 'x = -7 apenas' },
      { id: 'C', text: 'x = 7 ou x = -7' },
      { id: 'D', text: 'x = 49' }
    ],
    correct_answer: 'C',
    topic: 'Álgebra básica',
    difficulty: 'easy',
    explanation: 'A raiz quadrada de 49 é ±7'
  },
  {
    id: '5',
    question_text: 'Qual é o valor de y se 5y/2 = 15?',
    alternatives: [
      { id: 'A', text: 'y = 4' },
      { id: 'B', text: 'y = 5' },
      { id: 'C', text: 'y = 6' },
      { id: 'D', text: 'y = 7' }
    ],
    correct_answer: 'C',
    topic: 'Álgebra básica',
    difficulty: 'easy',
    explanation: '5y = 30, então y = 6'
  },

  // Geometria (4 questions)
  {
    id: '6',
    question_text: 'Qual é a área de um quadrado com lado igual a 8 cm?',
    alternatives: [
      { id: 'A', text: '32 cm²' },
      { id: 'B', text: '64 cm²' },
      { id: 'C', text: '16 cm²' },
      { id: 'D', text: '48 cm²' }
    ],
    correct_answer: 'B',
    topic: 'Geometria',
    difficulty: 'easy',
    explanation: 'Área = lado², então 8² = 64 cm²'
  },
  {
    id: '7',
    question_text: 'Um triângulo retângulo tem catetos de 3 cm e 4 cm. Qual é o comprimento da hipotenusa?',
    alternatives: [
      { id: 'A', text: '5 cm' },
      { id: 'B', text: '6 cm' },
      { id: 'C', text: '7 cm' },
      { id: 'D', text: '8 cm' }
    ],
    correct_answer: 'A',
    topic: 'Geometria',
    difficulty: 'medium',
    explanation: 'Pelo teorema de Pitágoras: 3² + 4² = h², então 9 + 16 = 25, h = 5 cm'
  },
  {
    id: '8',
    question_text: 'Qual é o perímetro de um retângulo com base 10 cm e altura 6 cm?',
    alternatives: [
      { id: 'A', text: '16 cm' },
      { id: 'B', text: '32 cm' },
      { id: 'C', text: '60 cm' },
      { id: 'D', text: '30 cm' }
    ],
    correct_answer: 'B',
    topic: 'Geometria',
    difficulty: 'easy',
    explanation: 'Perímetro = 2(base + altura) = 2(10 + 6) = 32 cm'
  },
  {
    id: '9',
    question_text: 'Quantos graus tem a soma dos ângulos internos de um triângulo?',
    alternatives: [
      { id: 'A', text: '90°' },
      { id: 'B', text: '180°' },
      { id: 'C', text: '270°' },
      { id: 'D', text: '360°' }
    ],
    correct_answer: 'B',
    topic: 'Geometria',
    difficulty: 'easy',
    explanation: 'A soma dos ângulos internos de qualquer triângulo é sempre 180°'
  },

  // Raciocínio lógico (4 questions)
  {
    id: '10',
    question_text: 'Complete a sequência: 2, 4, 8, 16, __',
    alternatives: [
      { id: 'A', text: '24' },
      { id: 'B', text: '28' },
      { id: 'C', text: '32' },
      { id: 'D', text: '20' }
    ],
    correct_answer: 'C',
    topic: 'Raciocínio lógico',
    difficulty: 'easy',
    explanation: 'Cada número é o dobro do anterior: 16 × 2 = 32'
  },
  {
    id: '11',
    question_text: 'Se todos os A são B, e alguns B são C, então:',
    alternatives: [
      { id: 'A', text: 'Todos os A são C' },
      { id: 'B', text: 'Alguns A podem ser C' },
      { id: 'C', text: 'Nenhum A é C' },
      { id: 'D', text: 'Todos os C são A' }
    ],
    correct_answer: 'B',
    topic: 'Raciocínio lógico',
    difficulty: 'hard',
    explanation: 'Não podemos garantir que todos os A sejam C, mas alguns podem ser'
  },
  {
    id: '12',
    question_text: 'Qual número não pertence à série: 2, 3, 5, 7, 11, 12, 13',
    alternatives: [
      { id: 'A', text: '2' },
      { id: 'B', text: '12' },
      { id: 'C', text: '13' },
      { id: 'D', text: '7' }
    ],
    correct_answer: 'B',
    topic: 'Raciocínio lógico',
    difficulty: 'medium',
    explanation: 'Todos são números primos exceto o 12'
  },
  {
    id: '13',
    question_text: 'Complete: 1, 1, 2, 3, 5, 8, __',
    alternatives: [
      { id: 'A', text: '11' },
      { id: 'B', text: '12' },
      { id: 'C', text: '13' },
      { id: 'D', text: '10' }
    ],
    correct_answer: 'C',
    topic: 'Raciocínio lógico',
    difficulty: 'medium',
    explanation: 'Sequência de Fibonacci: cada número é a soma dos dois anteriores (5 + 8 = 13)'
  },

  // Porcentagem e razão (4 questions)
  {
    id: '14',
    question_text: 'Quanto é 25% de 200?',
    alternatives: [
      { id: 'A', text: '25' },
      { id: 'B', text: '50' },
      { id: 'C', text: '75' },
      { id: 'D', text: '100' }
    ],
    correct_answer: 'B',
    topic: 'Porcentagem e razão',
    difficulty: 'easy',
    explanation: '25% de 200 = 0,25 × 200 = 50'
  },
  {
    id: '15',
    question_text: 'Um produto que custava R$ 100 teve um aumento de 20%. Qual é o novo preço?',
    alternatives: [
      { id: 'A', text: 'R$ 110' },
      { id: 'B', text: 'R$ 115' },
      { id: 'C', text: 'R$ 120' },
      { id: 'D', text: 'R$ 125' }
    ],
    correct_answer: 'C',
    topic: 'Porcentagem e razão',
    difficulty: 'easy',
    explanation: '100 + (20% de 100) = 100 + 20 = R$ 120'
  },
  {
    id: '16',
    question_text: 'A razão entre 15 e 45 é:',
    alternatives: [
      { id: 'A', text: '1:2' },
      { id: 'B', text: '1:3' },
      { id: 'C', text: '1:4' },
      { id: 'D', text: '2:3' }
    ],
    correct_answer: 'B',
    topic: 'Porcentagem e razão',
    difficulty: 'medium',
    explanation: '15/45 = 1/3, ou seja, 1:3'
  },
  {
    id: '17',
    question_text: 'Se 30% dos alunos de uma turma são meninas e há 21 meninas, quantos alunos há na turma?',
    alternatives: [
      { id: 'A', text: '60' },
      { id: 'B', text: '63' },
      { id: 'C', text: '70' },
      { id: 'D', text: '75' }
    ],
    correct_answer: 'C',
    topic: 'Porcentagem e razão',
    difficulty: 'hard',
    explanation: 'Se 30% = 21, então 100% = 21/0,3 = 70'
  },

  // Funções (3 questions)
  {
    id: '18',
    question_text: 'Dada a função f(x) = 2x + 3, qual é o valor de f(5)?',
    alternatives: [
      { id: 'A', text: '10' },
      { id: 'B', text: '11' },
      { id: 'C', text: '12' },
      { id: 'D', text: '13' }
    ],
    correct_answer: 'D',
    topic: 'Funções',
    difficulty: 'easy',
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13'
  },
  {
    id: '19',
    question_text: 'Para qual valor de x a função f(x) = 3x - 6 é igual a zero?',
    alternatives: [
      { id: 'A', text: 'x = 1' },
      { id: 'B', text: 'x = 2' },
      { id: 'C', text: 'x = 3' },
      { id: 'D', text: 'x = 6' }
    ],
    correct_answer: 'B',
    topic: 'Funções',
    difficulty: 'medium',
    explanation: '3x - 6 = 0, então 3x = 6, logo x = 2'
  },
  {
    id: '20',
    question_text: 'Se g(x) = x² - 4, qual é o valor de g(3)?',
    alternatives: [
      { id: 'A', text: '3' },
      { id: 'B', text: '5' },
      { id: 'C', text: '7' },
      { id: 'D', text: '9' }
    ],
    correct_answer: 'B',
    topic: 'Funções',
    difficulty: 'medium',
    explanation: 'g(3) = 3² - 4 = 9 - 4 = 5'
  }
];

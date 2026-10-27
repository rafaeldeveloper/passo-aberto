export const COORDENACAO = 'Alberto e Bronner';
export const COORDENACAO_COMPLETA = 'Alberto Albuquerque e Bronner';
export const COORDENACAO_OU = 'Alberto ou Bronner';
export const CONTATO_EMAIL = 'ferreira.rafaelc@gmail.com';

export const mailtoAjuda = (assunto: string, corpo = '') => {
  const params = new URLSearchParams({ subject: assunto, ...(corpo ? { body: corpo } : {}) });
  return `mailto:${CONTATO_EMAIL}?${params.toString().replace(/\+/g, '%20')}`;
};

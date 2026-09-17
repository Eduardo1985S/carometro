/**
 * Calcula a idade de uma pessoa a partir da data de nascimento (formato YYYY-MM-DD ou Date)
 * @param {string|Date} dataNascimento 
 * @returns {number|null}
 */
export function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  if (isNaN(nascimento.getTime())) return null;

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 0 ? idade : null;
}

/**
 * Formata data no padrão brasileiro DD/MM/AAAA
 * @param {string|Date} dataStr 
 * @returns {string}
 */
export function formatarData(dataStr) {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  if (isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
}

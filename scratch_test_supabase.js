import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(url, key);

async function testAuth() {
  console.log('--- TESTE LOGIN admin@senai.br ---');
  const res1 = await supabase.auth.signInWithPassword({
    email: 'admin@senai.br',
    password: 'senai2026'
  });
  console.log('Login admin@senai.br:', res1.error ? res1.error.message : 'SUCESSO! User ID: ' + res1.data?.user?.id);

  console.log('\n--- TESTE LOGIN wushu.edu@gmail.com ---');
  const res2 = await supabase.auth.signInWithPassword({
    email: 'wushu.edu@gmail.com',
    password: 'senai2026'
  });
  console.log('Login wushu.edu@gmail.com:', res2.error ? res2.error.message : 'SUCESSO! User ID: ' + res2.data?.user?.id);

  // Se algum logou, testar inserção como autenticado
  const client = res1.data?.session ? supabase : (res2.data?.session ? supabase : null);
  if (client) {
    console.log('\n--- TESTE INSERÇÃO COMO AUTENTICADO ---');
    const { data, error } = await client.from('cursos').insert([
      { nome: 'Técnico em Desenvolvimento de Sistemas', sigla: 'DS', descricao: 'Curso de software', ativo: true }
    ]).select();
    if (error) {
      console.error('Erro na inserção autenticada:', error);
    } else {
      console.log('Inserção autenticada COM SUCESSO:', data);
    }
  }
}

testAuth();

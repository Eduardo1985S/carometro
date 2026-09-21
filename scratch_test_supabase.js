import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Ler .env
const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

console.log('URL:', url);
console.log('Key:', key ? key.substring(0, 15) + '...' : 'NONE');

const supabase = createClient(url, key);

async function runTest() {
  console.log('\n--- TESTE 1: Leitura de cursos ---');
  const { data: cursos, error: errCursos } = await supabase.from('cursos').select('*');
  if (errCursos) {
    console.error('Erro ao ler cursos:', errCursos);
  } else {
    console.log('Cursos encontrados:', cursos?.length, cursos);
  }

  console.log('\n--- TESTE 2: Leitura de turmas ---');
  const { data: turmas, error: errTurmas } = await supabase.from('turmas').select('*');
  if (errTurmas) {
    console.error('Erro ao ler turmas:', errTurmas);
  } else {
    console.log('Turmas encontradas:', turmas?.length, turmas);
  }

  console.log('\n--- TESTE 3: Tentativa de inserção de curso (anônimo) ---');
  const { data: newCurso, error: errInsert } = await supabase.from('cursos').insert([
    { nome: 'Curso Teste Diagnóstico', sigla: 'TEST', descricao: 'Teste', ativo: true }
  ]).select();
  if (errInsert) {
    console.error('Erro ao inserir curso (anônimo):', errInsert);
  } else {
    console.log('Curso inserido com sucesso:', newCurso);
  }

  console.log('\n--- TESTE 4: Leitura de profiles ---');
  const { data: profiles, error: errProfiles } = await supabase.from('profiles').select('*');
  if (errProfiles) {
    console.error('Erro ao ler profiles:', errProfiles);
  } else {
    console.log('Perfis encontrados:', profiles?.length, profiles);
  }

  console.log('\n--- TESTE 5: Leitura de alunos ---');
  const { data: alunos, error: errAlunos } = await supabase.from('alunos').select('*');
  if (errAlunos) {
    console.error('Erro ao ler alunos:', errAlunos);
  } else {
    console.log('Alunos encontrados:', alunos?.length, alunos);
  }

  console.log('\n--- TESTE 6: Bucket de fotos ---');
  const { data: buckets, error: errBuckets } = await supabase.storage.listBuckets();
  if (errBuckets) {
    console.error('Erro ao listar buckets:', errBuckets);
  } else {
    console.log('Buckets encontrados:', buckets?.map(b => b.name));
  }
}

runTest();

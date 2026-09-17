// Supabase Edge Function: manage-users
// Utiliza a SERVICE_ROLE_KEY de forma segura no backend Supabase para gerenciar usuários no Auth
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verificar se quem está chamando é admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, ativo')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin' || !profile.ativo) {
      return new Response(JSON.stringify({ error: 'Permissão negada. Apenas administradores ativos.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Cliente com permissão total (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, payload } = await req.json();

    if (action === 'createUser') {
      const { email, password, nome, role } = payload;
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: password || 'Senai@2026',
        email_confirm: true,
        user_metadata: { nome }
      });

      if (createError) throw createError;

      // Inserir ou atualizar perfil
      await supabaseAdmin.from('profiles').upsert({
        id: newUser.user.id,
        nome,
        email,
        role: role || 'admin',
        ativo: true
      });

      return new Response(JSON.stringify({ message: 'Usuário criado com sucesso', user: newUser.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (action === 'deleteUser') {
      const { userId } = payload;
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      await supabaseAdmin.from('profiles').delete().eq('id', userId);

      return new Response(JSON.stringify({ message: 'Usuário removido com sucesso' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

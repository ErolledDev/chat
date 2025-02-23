import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface ChatSettings {
  id: string;
  user_id: string;
  business_name: string;
  prompt_context: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface ChatLog {
  id: string;
  user_id: string;
  session_id: string;
  message: string;
  response: string;
  tokens_used: number;
  created_at: string;
}

// Helper functions for chat operations
export async function getChatSettings(userId: string) {
  const { data, error } = await supabase
    .from('chat_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateChatSettings(userId: string, settings: Partial<ChatSettings>) {
  const { data, error } = await supabase
    .from('chat_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function logChat(chatLog: Omit<ChatLog, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('chat_logs')
    .insert(chatLog)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function validateApiKey(apiKey: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_value', apiKey)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export async function updateApiKeyLastUsed(keyId: string) {
  const { error } = await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyId);

  if (error) throw error;
}
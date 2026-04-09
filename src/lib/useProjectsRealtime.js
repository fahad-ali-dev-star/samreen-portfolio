import { useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

export function useProjectsRealtime(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          callbackRef.current?.();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIPTION_ERROR') console.warn('Realtime subscription error');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

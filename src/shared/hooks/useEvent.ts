/**
 * 이벤트 조회를 위한 커스텀 훅
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { esportsApiService } from '../services/esportsApi';
import { useToast } from '../components/Toast';
import { handleEventFetchError } from '../utils/esportsErrorHandler';
import type { Event } from '../types/esports';

export function useEvent() {
  const router = useRouter();
  const { eventId } = router.query;
  const { showToast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await esportsApiService.getEvent(eventId);
      setEvent(eventData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      handleEventFetchError(err, router, showToast);
    } finally {
      setLoading(false);
    }
  };

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}




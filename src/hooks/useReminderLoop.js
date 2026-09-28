import { useCallback, useEffect, useRef, useState } from 'react';
import { dueReminders, reminderMessage } from '../utils/reminders';

const CHECK_INTERVAL_MS = 20000;

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    osc.onended = () => ctx.close();
  } catch (e) {
    // Web Audio no disponible en este navegador; la notificación visual sigue funcionando.
  }
}

/**
 * Revisa cada 20s si hay medicamentos o citas médicas justo a su hora y los
 * anuncia con sonido + notificación del sistema + un banner en pantalla que
 * hay que confirmar. Pensado para personas mayores: el aviso no desaparece
 * solo, hay que tocar "Ya lo tomé"/"Entendido".
 */
export function useReminderLoop({ medications, medLog, appointments, enabled }) {
  const [queue, setQueue] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const firedRef = useRef(new Set());

  const checkNow = useCallback(() => {
    if (!enabled) return;
    const due = dueReminders(medications, medLog, appointments, new Date());
    const fresh = due.filter((item) => !firedRef.current.has(item.id));
    if (fresh.length === 0) return;
    fresh.forEach((item) => firedRef.current.add(item.id));
    setQueue((q) => [...q, ...fresh]);
    fresh.forEach((item) => notifySystem('Glucosia', reminderMessage(item)));
    playBeep();
  }, [medications, medLog, appointments, enabled]);

  useEffect(() => {
    checkNow();
    const interval = setInterval(checkNow, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkNow]);

  useEffect(() => {
    if (!activeReminder && queue.length > 0) {
      setActiveReminder(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [activeReminder, queue]);

  function dismissReminder() {
    setActiveReminder(null);
  }

  return { activeReminder, dismissReminder };
}

export async function requestReminderPermission() {
  if (!window.Notification) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

export function notifySystem(title, body) {
  if (window.Notification && Notification.permission === 'granted') {
    try {
      // eslint-disable-next-line no-new
      new Notification(title, { body });
    } catch (e) {
      // Algunos navegadores móviles no permiten `new Notification` fuera de un Service Worker; el banner en pantalla sigue avisando.
    }
  }
}

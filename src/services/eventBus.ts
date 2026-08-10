/**
 * Noor Al-Amani Platform - Decoupled Event Bus (Loose Coupling Observer Pattern)
 * ناقل الأحداث السيادي لإلغاء الاقتران القوي بين المكونات والقطاعات المختلفة (NA-EVENT-BUS-001 v1.0)
 */

export type SectorEventType =
  | 'PUBLISHER_VISITED'
  | 'REPORT_SUBMITTED'
  | 'FAIR_WEIGHTS_UPDATED'
  | 'SECTOR_TAB_CHANGED'
  | 'AUDIT_LOG_ADDED';

export interface SectorEvent<T = unknown> {
  type: SectorEventType;
  payload: T;
  timestamp: number;
}

type EventCallback<T = unknown> = (event: SectorEvent<T>) => void;

class SovereignEventBus {
  private static instance: SovereignEventBus;
  private listeners: Map<SectorEventType, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): SovereignEventBus {
    if (!SovereignEventBus.instance) {
      SovereignEventBus.instance = new SovereignEventBus();
    }
    return SovereignEventBus.instance;
  }

  /**
   * Subscribe to a sector event with automatic cleanup reference
   */
  public subscribe<T = unknown>(eventType: SectorEventType, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    const callbacks = this.listeners.get(eventType)!;
    callbacks.add(callback as EventCallback);

    return () => {
      callbacks.delete(callback as EventCallback);
    };
  }

  /**
   * Publish an event asynchronously to all loose subscribers
   */
  public publish<T = unknown>(eventType: SectorEventType, payload: T): void {
    const callbacks = this.listeners.get(eventType);
    if (!callbacks || callbacks.size === 0) return;

    const event: SectorEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    callbacks.forEach((cb) => {
      try {
        cb(event as SectorEvent);
      } catch (err) {
        console.error("Error in Noor Al-Amani Module:", err);
      }
    });
  }
}

export const eventBus = SovereignEventBus.getInstance();

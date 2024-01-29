/**
 * The utility function Opaque<K, T> simply defines a new type that,
 * aside from a variable’s value, also stores a (unique) key.
 *
 * This then allows TypeScript to differentiate between different types,
 * even though all still store plain K type and do not change the compiler’s output.
 *
 * @example
 * const trackLogin = (currentDate: DateISOString, sessionId: Uuid) => { someCode(); }
 *
 * const sessionUuid = currentSession.getUuid() as Uuid;
 * const currentDate = new Date().toISOString() as DateISOString;
 *
 * trackLogin(sessionUuid, currentDate); // TypeScript will now understand this function call and show an error
 */
type Opaque<K, T> = T & { __TYPE__: K };

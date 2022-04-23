import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// useRef instead of this??
// Tested when rerendering but was NOT set back to null
let socketRef = null;
const useSocketIO = (jwt, connectedCallback, disconnectCallback, errorCallback) => {
	const [socketError, setSocketError] = useState(false); // Socket has any errors?
	const [socketLoading, setSocketLoading] = useState(true); // Socket still loading?

	useEffect(() => {
		connectSocket();
		// Prevent memory leak if component was unmounted bfr being called
		return () => {
			disconnectSocket();
		};
	}, []);

	/**
	 * Connects the socket to the Server
	 */
	const connectSocket = () => {
		socketRef = io("http://localhost:5000", { auth: { token: jwt } });
		socketRef.on("connect", () => {
			console.log("SocketIO Connected!");
			connectedCallback();
			setSocketError(false);
			setSocketLoading(false);
		});
		socketRef.on("disconnect", () => {
			console.log("SocketIO Disconnected!");
			disconnectCallback();
			/* No need to call disconnectSocket(), as socket as already
			been disconnected. */
			// Reset state
			setSocketError(false);
			setSocketLoading(true);
		});
		socketRef.on("connect_error", (err) => {
			console.log("SocketIO Connect Error:", err.message);
			// Disconnect socket and call connection callback
			errorCallback();
			disconnectSocket();
			setSocketError(true);
		});
	};
	/**
	 * Disconnects the socket from the Server,
	 */
	const disconnectSocket = () => {
		if (!socketRef) return;
		socketRef.disconnect();
		socketRef = null;
	};

	/**
	 * Returns whether the socket is loading
	 * @returns socketLoading
	 */
	const isSocketLoading = () => socketLoading;
	/**
	 * Returns whether the socket has any erros
	 * @returns socketError
	 */
	const isSocketError = () => socketError;

	/**
	 * Register listener function to SocketIO event
	 * @param {String} eventName Event to listen to
	 * @param {Function} listenerFunc Function to receive the event
	 */
	const registerListener = (eventName, listenerFunc) => socketRef && socketRef.on(eventName, listenerFunc);
	/**
	 * Unregister listener function to SocketIO event
	 * @param {String} eventName Event to unregister from
	 * @param {Function} listenerFunc Function that was receiving the event
	 */
	const unregisterListener = (eventName, listenerFunc) => socketRef && socketRef.off(eventName, listenerFunc);
	/**
	 * Emits event to SocketIO Listener
	 * @param {*} eventName Event name to emit
	 * @param {*} payload Payload to carry when emitting event
	 */
	const emitEvent = (eventName, payload) => socketRef && socketRef.emit(eventName, payload);

	return { unregisterListener, registerListener, emitEvent, isSocketError, isSocketLoading };
};

export default useSocketIO;

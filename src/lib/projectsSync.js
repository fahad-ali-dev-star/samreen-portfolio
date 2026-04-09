const channelName = 'projects-updated';

export function notifyProjectsChanged() {
  let channel = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(channelName);
      channel.postMessage({ type: 'projects-changed', at: Date.now() });
    }
  } catch (error) {
    console.warn('Project sync broadcast failed:', error);
  } finally {
    if (channel) {
      channel.close();
    }
  }

  try {
    localStorage.setItem(channelName, String(Date.now()));
  } catch (error) {
    console.warn('Project sync storage event failed:', error);
  }
}

export function subscribeToProjectsChanges(callback) {
  let channel = null;

  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(channelName);
      channel.onmessage = event => {
        if (event.data?.type === 'projects-changed') {
          callback();
        }
      };
    }
  } catch (error) {
    console.warn('Project sync listener failed:', error);
  }

  const storageHandler = event => {
    if (event.key === channelName) {
      callback();
    }
  };

  window.addEventListener('storage', storageHandler);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', storageHandler);
  };
}

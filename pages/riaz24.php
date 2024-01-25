<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                // Trigger the initial sync immediately
                if ('SyncManager' in window) {
                    return registration.sync.register('syncJokes');
                }
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
</script>
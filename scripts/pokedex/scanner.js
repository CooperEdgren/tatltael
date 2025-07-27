// scanner.js

/**
 * Initializes and manages the QR code scanner.
 */
export class QRScanner {
    constructor(readerElementId, onScanSuccess, onScanFailure) {
        this.readerElementId = readerElementId;
        this.onScanSuccess = onScanSuccess;
        this.onScanFailure = onScanFailure;
        this.html5QrCode = null;
    }

    /**
     * Starts the camera and begins scanning for QR codes.
     */
    start() {
        this.html5QrCode = new Html5Qrcode(this.readerElementId);
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        // Request camera permissions and start scanning.
        this.html5QrCode.start(
            { facingMode: "environment" },
            config,
            this.onScanSuccess,
            this.onScanFailure
        ).catch(err => {
            console.error("Unable to start QR scanner", err);
            alert("Error: Could not start the camera. Please grant camera permissions.");
        });
    }

    /**
     * Stops the camera and scanning.
     */
    stop() {
        if (this.html5QrCode) {
            this.html5QrCode.stop().then(() => {
                console.log("QR scanner stopped.");
            }).catch(err => {
                console.error("Failed to stop QR scanner", err);
            });
        }
    }
}

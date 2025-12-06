import { useState } from "react";

const FileLoader = ({ onLoad, onError, maxSize }) => {
    const [fileName, setFileName] = useState("");
    const [preview, setPreview] = useState(null);

    const parseFile = (text) => {
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (lines.length < 2) {
            throw new Error(
                "File is too short. Expected dimension and matrix rows."
            );
        }

        const n = Number.parseInt(lines[0], 10);
        if (!Number.isInteger(n) || n <= 0) {
            throw new Error(
                "First line must be a positive integer (matrix dimension)."
            );
        }
        if (n > maxSize) {
            throw new Error(`Matrix dimension must not exceed ${maxSize}.`);
        }

        // очікуємо n рядків з n+1 числом у кожному (A | B)
        if (lines.length < n + 1) {
            throw new Error(
                `File should contain ${n} rows of augmented matrix (each with ${
                    n + 1
                } numbers).`
            );
        }

        const matrix = [];
        const vector = [];

        lines.slice(1, n + 1).forEach((line, idx) => {
            const row = line.split(/\s+/).map((v) => Number.parseFloat(v));

            if (row.length !== n + 1 || row.some((v) => Number.isNaN(v))) {
                throw new Error(
                    `Row ${idx + 1} must contain ${
                        n + 1
                    } numeric values (a11 ... a1${n} b1).`
                );
            }

            matrix.push(row.slice(0, n)); // коефіцієнти A
            vector.push(row[n]); // вільний член b_i
        });

        return { n, matrix, vector };
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const result = parseFile(String(reader.result));
                setPreview(result);
                onLoad(result);
                onError("");
            } catch (err) {
                setPreview(null);
                onError(err.message);
            }
        };
        reader.onerror = () => {
            onError("Failed to read the file.");
        };
        reader.readAsText(file);
    };

    return (
        <div className="section-card">
            <h2>File upload</h2>
            <p className="method-hint" style={{ marginBottom: "10px" }}>
                Use the prescribed text format: n, n rows for A, then one row
                for B.
            </p>
            <div className="stack" style={{ maxWidth: "420px" }}>
                <input type="file" accept=".txt" onChange={handleFileChange} />
                {fileName && <p className="method-hint">Loaded: {fileName}</p>}
                <div className="info-block">
                    <strong>Example</strong>
                    <pre className="code-pill" style={{ marginTop: "8px" }}>
                        {`3
2 1 -1 8
-3 -1 2 -11
-2 1 2 -3`}
                    </pre>
                </div>
                {preview && (
                    <div className="info-block">
                        <strong>Parsed system</strong>
                        <p className="method-hint" style={{ marginTop: "6px" }}>
                            n = {preview.n} · A rows: {preview.matrix.length}, B
                            length: {preview.vector.length}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileLoader;

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importar el archivo CSS

function App() {
  const [departamento, setDepartamento] = useState("");
  const [cultivoRecomendado, setCultivoRecomendado] = useState(null); // Para el cultivo recomendado
  const [recomendacionRiego, setRecomendacionRiego] = useState(null); // Para la recomendación de riego
  const [prediccion, setPrediccion] = useState(null);
  const [grafico, setGrafico] = useState(null); // Para el gráfico de predicción (mapa de calor)
  const [graficoLinea, setGraficoLinea] = useState(null); // Para el gráfico de línea de progresión de temperatura
  const [analisisTexto, setAnalisisTexto] = useState(null); // Para el análisis de texto generado por GPT-2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewResults, setViewResults] = useState(false); // Nuevo estado para controlar la visualización de los resultados

  const handleChange = (e) => {
    setDepartamento(e.target.value);
  };

  const handleSubmit = async () => {
    if (!departamento) {
      setError("Por favor, selecciona un departamento.");
      return;
    }

    setLoading(true);
    setError("");
    setViewResults(true); // Mostrar los resultados cuando se selecciona un departamento

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', {
        departamento,
        año: 2023,  // Puedes cambiar esto según lo que necesites
      });

      setPrediccion(response.data.prediccion);
      setGrafico(response.data.grafico); // Para el mapa de calor
      setGraficoLinea(response.data.grafico_linea); // Para el gráfico de línea
      setAnalisisTexto(response.data.analisis_texto); // Guardar el análisis generado por GPT-2
      setCultivoRecomendado(response.data.cultivo_recomendado); // Guardar el cultivo recomendado
      setRecomendacionRiego(response.data.recomendacion_riego); // Guardar la recomendación de riego
    } catch (error) {
      setError("Hubo un error al obtener la predicción.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setViewResults(false); // Ocultar los resultados
    setDepartamento(""); // Limpiar la selección de departamento
    setPrediccion(null);
    setGrafico(null);
    setGraficoLinea(null);
    setAnalisisTexto(null); // Limpiar el análisis
    setCultivoRecomendado(null); // Limpiar el cultivo recomendado
    setRecomendacionRiego(null); // Limpiar la recomendación de riego
    setError("");
  };

  return (
      <div className="App">
        <div className="main-content">
          <h1 className="header">Predicción de Clima por Departamento</h1>

          {/* Mostrar solo la selección de departamento si no se han visto los resultados */}
          {!viewResults && (
              <div className="department-selection">
                <h2>Selecciona un Departamento</h2>
                <select className="department-select" value={departamento} onChange={handleChange}>
                  <option value="">Selecciona un Departamento</option>
                  <option value="Junín">Junín</option>
                  <option value="Ayacucho">Ayacucho</option>
                  <option value="Cusco">Cusco</option>
                  <option value="Puno">Puno</option>
                </select>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Cargando...' : 'Obtener Predicción'}
                </button>

                {/* Mostrar errores */}
                {error && <p className="error-message">{error}</p>}
              </div>
          )}

          {/* Mostrar los resultados si viewResults es verdadero */}
          {viewResults && (
              <div className="results">
                {/* Mostrar la predicción */}
                {prediccion && (
                    <div className="prediction-section">
                      <h2>Predicción:</h2>
                      <p>{prediccion.join(', ')}</p>
                    </div>
                )}

                {/* Mostrar el cultivo recomendado */}
                {cultivoRecomendado && (
                    <div className="cultivo-recomendado-section">
                      <h2>Cultivo Recomendado:</h2>
                      <p>{cultivoRecomendado}</p>
                    </div>
                )}

                {/* Mostrar la recomendación de riego */}
                {recomendacionRiego && (
                    <div className="recomendacion-riego-section">
                      <h2>Recomendación de Riego:</h2>
                      <p>{recomendacionRiego}</p>
                    </div>
                )}

                {/* Mostrar el gráfico de la progresión de temperatura */}
                {graficoLinea && (
                    <div className="graph-section">
                      <h2>Progresión de Temperatura:</h2>
                      <img src={`data:image/png;base64,${graficoLinea}`} alt="Gráfico de progresión de temperatura" />
                    </div>
                )}

                {/* Mostrar el gráfico del mapa de calor */}
                {grafico && (
                    <div className="map-section">
                      <h2>Mapa de Calor:</h2>
                      <iframe
                          src={`data:text/html;base64,${grafico}`}
                          width="100%"
                          height="400px"
                          title="Mapa de Calor"
                          style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                      ></iframe>
                    </div>
                )}

                {/* Mostrar el análisis de texto */}
                {analisisTexto && (
                    <div className="analysis-section">
                      <h2>Análisis de la Predicción:</h2>
                      <p>{analisisTexto}</p>
                    </div>
                )}

                {/* Botón para retroceder */}
                <button className="back-btn" onClick={handleBack}>Volver a Selección de Departamento</button>
              </div>
          )}
        </div>
      </div>
  );
}

export default App;

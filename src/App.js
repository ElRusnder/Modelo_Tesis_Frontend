import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Importar el archivo CSS

function App() {
  const [departamento, setDepartamento] = useState("");
  const [cultivoRecomendado, setCultivoRecomendado] = useState(null); // Cambiar a null
  const [grafico, setGrafico] = useState(null); // Para el gráfico de predicción (mapa de calor)
  const [graficoBarras, setGraficoBarras] = useState(null); // Para el gráfico de barras
  const [analisisTexto, setAnalisisTexto] = useState(null); // Para el análisis de texto generado por GPT-2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewResults, setViewResults] = useState(false); // Nuevo estado para controlar la visualización de los resultados

  const [startYear, setStartYear] = useState(""); // Año de inicio
  const [startMonth, setStartMonth] = useState(""); // Mes de inicio
  const [endYear, setEndYear] = useState(""); // Año de finalización
  const [endMonth, setEndMonth] = useState(""); // Mes de finalización

  const handleChange = (e) => {
    setDepartamento(e.target.value);
  };

  const handleSubmit = async () => {
    if (!departamento || !startYear || !startMonth || !endYear || !endMonth) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");
    setViewResults(true); // Mostrar los resultados cuando se selecciona un departamento

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', {
        departamento,
        start_year: startYear, // Enviar el año de inicio
        start_month: startMonth, // Enviar el mes de inicio
        end_year: endYear, // Enviar el año de finalización
        end_month: endMonth, // Enviar el mes de finalización
      });

      setGrafico(response.data.grafico); // Para el mapa de calor
      setGraficoBarras(response.data.grafico_barras); // Para el gráfico de barras
      setAnalisisTexto(response.data.analisis_texto); // Guardar el análisis generado por GPT-2
      setCultivoRecomendado(response.data.cultivo_recomendado); // Guardar las recomendaciones de cultivo
    } catch (error) {
      setError("Hubo un error al obtener la predicción.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setViewResults(false); // Ocultar los resultados
    setDepartamento(""); // Limpiar la selección de departamento
    setStartYear(""); // Limpiar el año de inicio
    setStartMonth(""); // Limpiar el mes de inicio
    setEndYear(""); // Limpiar el año de finalización
    setEndMonth(""); // Limpiar el mes de finalización
    setGrafico(null);
    setGraficoBarras(null); // Limpiar el gráfico de barras
    setAnalisisTexto(null); // Limpiar el análisis
    setCultivoRecomendado(null); // Limpiar las recomendaciones de cultivo
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

                <h2>Selecciona el Año y Mes de Inicio</h2>
                <select className="year-month-select" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                  <option value="">Año</option>
                  {/* Años desde 2024 hasta 2032 */}
                  {[...Array(9)].map((_, index) => {
                    const year = 2024 + index;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <select className="year-month-select" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                  <option value="">Mes</option>
                  {[...Array(12)].map((_, index) => {
                    return <option key={index} value={index + 1}>{index + 1}</option>;
                  })}
                </select>

                <h2>Selecciona el Año y Mes de Finalización</h2>
                <select className="year-month-select" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                  <option value="">Año</option>
                  {/* Años desde 2024 hasta 2032 */}
                  {[...Array(9)].map((_, index) => {
                    const year = 2024 + index;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                <select className="year-month-select" value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                  <option value="">Mes</option>
                  {[...Array(12)].map((_, index) => {
                    return <option key={index} value={index + 1}>{index + 1}</option>;
                  })}
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
                {/* Mostrar las recomendaciones de cultivo */}
                {cultivoRecomendado && (
                    <div className="cultivo-recomendado-section">
                      <h2>Cultivo Recomendado:</h2>
                      <h3>{cultivoRecomendado.cultivo_recomendado}</h3>
                      <p><strong>Recomendación de Riego:</strong> {cultivoRecomendado.recomendacion_riego}</p>
                      <p><strong>Descripción del Cultivo:</strong> {cultivoRecomendado.descripcion_cultivo}</p>
                    </div>
                )}

                {/* Mostrar el gráfico de la progresión de temperatura */}
                {graficoBarras && (
                    <div className="graph-section">
                      <h2>Predicción de Temperatura:</h2>
                      <img src={`data:image/png;base64,${graficoBarras}`} alt="Gráfico de predicción de temperatura" />
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

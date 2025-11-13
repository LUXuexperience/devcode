import React from 'react';

const LegalFramework: React.FC = () => {
    const sectionTitleClass = "text-lg font-semibold text-emerald-400 mt-6 mb-2";
    const subTitleClass = "text-md font-semibold text-slate-100 mt-4 mb-1";
    const textClass = "text-sm text-slate-400 leading-relaxed";
    const listClass = "list-disc list-inside space-y-1 pl-4";

    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <h2 className={sectionTitleClass}>📋 Marco Legal Aplicable en México</h2>
            <p className={textClass}>
                La operación de este sistema de monitoreo se adhiere estrictamente a las siguientes leyes y normativas vigentes en México, así como a estándares internacionales relevantes para garantizar la seguridad, privacidad y el correcto manejo de la información.
            </p>

            <h3 className={subTitleClass}>Leyes y Normativas Principales:</h3>
            <ul className={`${listClass} ${textClass}`}>
                <li>
                    <strong>Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP):</strong> Regula el tratamiento de datos personales para garantizar la privacidad y el derecho a la autodeterminación informativa de las personas. Todos los datos de los operadores son manejados con estricta confidencialidad.
                </li>
                <li>
                    <strong>Reglamento General de Protección de Datos (GDPR):</strong> Aunque es una normativa europea, sus principios se adoptan como buena práctica si el sistema involucra datos de ciudadanos o residentes europeos.
                </li>
                <li>
                    <strong>NOM-035-STPS-2018:</strong> Considera los factores de riesgo psicosocial en el trabajo, relevante para el bienestar de los operadores que monitorean situaciones de alto estrés.
                </li>
                <li>
                    <strong>Ley Federal de Telecomunicaciones y Radiodifusión:</strong> Regula el uso del espectro radioeléctrico y las redes de telecomunicaciones, aplicable a la transmisión de datos de las cámaras.
                </li>
                <li>
                    <strong>Código Penal Federal:</strong> Tipifica los delitos informáticos como el acceso ilícito a sistemas, garantizando la seguridad de nuestra infraestructura.
                </li>
                <li>
                    <strong>Ley de Seguridad Interior:</strong> Proporciona el marco para el uso de sistemas de videovigilancia en zonas consideradas estratégicas para la seguridad del país.
                </li>
            </ul>

            <h2 className={sectionTitleClass}>Políticas de Privacidad</h2>
            <p className={textClass}>
                Nuestra política de privacidad se basa en la transparencia, seguridad y control del usuario sobre sus datos.
            </p>
            <ul className={`${listClass} ${textClass}`}>
                <li><strong>Recopilación de Datos:</strong> Solo se recopilan los datos estrictamente necesarios para la operación del sistema, como credenciales de acceso y registros de actividad (bitácora) con fines de auditoría y seguridad.</li>
                <li><strong>Uso de la Información:</strong> Los datos de video son utilizados exclusivamente para la detección y monitoreo de incendios forestales. No se utilizarán para fines comerciales ni se compartirán con terceros no autorizados.</li>
                <li><strong>Seguridad de los Datos:</strong> Implementamos medidas de seguridad técnicas y organizativas para proteger los datos contra acceso no autorizado, alteración o destrucción.</li>
                <li><strong>Derechos ARCO:</strong> Los usuarios pueden ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales contactando al administrador del sistema.</li>
            </ul>
        </div>
    );
};

export default LegalFramework;

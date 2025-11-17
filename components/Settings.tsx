import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSettings } from '../store/settingsSlice';
import { persistor } from '../store'; // 1. Importar el 'persistor'
import { ExclamationTriangleIcon } from './Icons'; // 2. Importar el ícono de advertencia

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.settings);

    const [taxRate, setTaxRate] = useState(0);
    const [companyName, setCompanyName] = useState('');
    const [companyCuit, setCompanyCuit] = useState('');

    useEffect(() => {
        if (settings) {
            setTaxRate(settings.taxRate * 100); 
            setCompanyName(settings.companyName);
            setCompanyCuit(settings.companyCuit);
        }
    }, [settings]);

    const handleSave = () => {
        const newTaxRate = Number(taxRate) / 100;
        dispatch(setSettings({
            taxRate: isNaN(newTaxRate) ? 0.21 : newTaxRate,
            companyName,
            companyCuit
        }));
        alert('Configuración guardada');
    };

    // 3. Función para manejar el reseteo
    const handleReset = async () => {
        if (window.confirm("¿Está ABSOLUTAMENTE SEGURO? Esta acción borrará TODOS los datos (ventas, clientes, productos, etc.) y no se puede deshacer.")) {
            if (window.confirm("CONFIRMACIÓN FINAL: ¿Realmente desea reiniciar el sistema a sus valores de fábrica?")) {
                try {
                    await persistor.purge(); // Limpia el localStorage
                    alert('El sistema se ha reiniciado. La aplicación se recargará.');
                    window.location.reload(); // Recarga la página
                } catch (error) {
                    console.error("Error al reiniciar el sistema:", error);
                    alert('Hubo un error al reiniciar el sistema.');
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Configuración</h1>
                <p className="text-slate-500 mt-1">Ajuste las preferencias y configuraciones del sistema.</p>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Datos de la Empresa y Globales</h2>
                
                <div className="space-y-4 max-w-lg">
                    <div>
                        <label className="text-sm font-medium text-slate-600">Nombre de la Empresa</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600">CUIT</label>
                        <input
                            type="text"
                            value={companyCuit}
                            onChange={e => setCompanyCuit(e.target.value)}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600">Tasa de IVA (%)</label>
                        <input
                            type="number"
                            value={taxRate}
                            onChange={e => setTaxRate(Number(e.target.value))}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                            placeholder="Ej: 21"
                        />
                    </div>
                </div>

                 <button 
                    onClick={handleSave}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                 >
                    Guardar Cambios
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Roles de Usuario</h2>
                <p className="text-slate-600">
                    Esta sección permitirá crear diferentes tipos de usuarios (ej: Administrador, Vendedor) 
                    con accesos limitados a distintas partes del sistema para mayor seguridad.
                </p>
                <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                    Gestionar Roles (Próximamente)
                </button>
            </div>

            {/* 4. Nueva sección "Zona de Peligro" */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-500">
                <h2 className="text-lg font-semibold text-red-700 border-b border-red-200 pb-4 mb-6">Zona de Peligro</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div>
                        <p className="font-medium text-slate-800">Reiniciar el Sistema</p>
                        <p className="text-sm text-slate-600 max-w-md">
                            Esto borrará permanentemente todos los datos de la aplicación (Ventas, Clientes, Productos, etc.) 
                            y la restaurará a los datos de fábrica.
                        </p>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        Reiniciar Sistema
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;

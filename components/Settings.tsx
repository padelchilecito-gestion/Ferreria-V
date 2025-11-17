import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSettings } from '../store/settingsSlice'; // 1. Importar la acción

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    // 2. Leer los datos de configuración del store
    const settings = useSelector((state: RootState) => state.settings);

    // 3. Estados locales para los campos del formulario
    const [taxRate, setTaxRate] = useState(0);
    const [companyName, setCompanyName] = useState('');
    const [companyCuit, setCompanyCuit] = useState('');

    // 4. Sincronizar estado local con el store cuando se carga
    useEffect(() => {
        if (settings) {
            setTaxRate(settings.taxRate * 100); // Convertir 0.21 a 21
            setCompanyName(settings.companyName);
            setCompanyCuit(settings.companyCuit);
        }
    }, [settings]);

    // 5. Manejador para guardar los cambios
    const handleSave = () => {
        const newTaxRate = Number(taxRate) / 100; // Convertir 21 a 0.21
        dispatch(setSettings({
            taxRate: isNaN(newTaxRate) ? 0.21 : newTaxRate,
            companyName,
            companyCuit
        }));
        alert('Configuración guardada');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Configuración</h1>
                <p className="text-slate-500 mt-1">Ajuste las preferencias y configuraciones del sistema.</p>
            </div>

             {/* 6. Formulario de Datos de la Empresa (ACTUALIZADO) */}
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Datos de la Empresa</h2>
                
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
        </div>
    );
};

export default Settings;

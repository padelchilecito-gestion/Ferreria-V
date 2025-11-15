
import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 hidden lg:block">Configuración</h1>
                <p className="text-slate-500 mt-1">Ajuste las preferencias y configuraciones del sistema.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Roles de Usuario</h2>
                <p className="text-slate-600">
                    Esta sección permitirá crear diferentes tipos de usuarios (ej: Administrador, Vendedor) 
                    con accesos limitados a distintas partes del sistema para mayor seguridad.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Gestionar Roles</button>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 border-b pb-4 mb-6">Datos de la Empresa</h2>
                <p className="text-slate-600">
                    Aquí podrá configurar los datos de su ferretería, como el nombre, CUIT, dirección,
                    y logo para que aparezcan en los comprobantes y reportes.
                </p>
                 <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Editar Información</button>
            </div>
        </div>
    );
};

export default Settings;

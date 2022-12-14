import React, {useEffect, useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'
import api from '../../services/api';

import './styles.css'
import logoIMG from '../../assets/logo.svg'

export default function Profile(){
  const [incidents, setIncidents] = useState([]);
  const ongID = localStorage.getItem('ongID');
  const ongName = localStorage.getItem('ongName');
  const history = useNavigate();

  useEffect(()=> {
    api.get('profile',{
      headers:{
        Authorization: ongID,
      }
    }).then(response => {
      setIncidents(response.data);
    })
  },[ongID]);

  async function handleDeleteIncident(id){
    try{
      await api.delete(`incidents/${id}`, {
        headers:{
          Authorization: ongID,
        }
      });
      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch (err){
      alert('Erro ao deletar, tente novamente!');
    }
  }

  async function handleLogout(){
    localStorage.clear();
    history('/');
  }

  return(
    <div className="profile-container">
      <header>
        <img src={logoIMG} alt="Be The Hero" />
        <span>Bem vinda, {ongName}</span>
        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={20} color="#E02041"/>
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      <ul>
        {incidents.map(incident => (
          <li key={incident.id} class="incident-card">
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

            <button onClick={() => handleDeleteIncident(incident.id)} type="button">
              <FiTrash2 size={20} color="#a8a8b3"/>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
};
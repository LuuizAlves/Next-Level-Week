import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectUf, setSelectedUF] = useState('0');
    const [selectCity, setSelectCity] = useState('0');
    const [itemsSelecteds, setItemsSelecteds] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);

    const history = useHistory();

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(postion => {
            const {latitude, longitude} = postion.coords;
            setInitialPosition([latitude,longitude]);
        })
    },[])

    useEffect(()=>{
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const initials = response.data.map(uf => uf.sigla);
                
                setUfs(initials);
            })
    },[])

    useEffect(()=>{
        //Carrega a cidade sempre que a cidade muda
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
            .then(response => {
                const citiesReturn = response.data.map(city => city.nome);
                
                setCities(citiesReturn);
            })
    },[selectUf])

    function handleSubmitUF(event: ChangeEvent<HTMLSelectElement>){
        const ufSelect = event.target.value;
        setSelectedUF(ufSelect);
    }

    function handleSubmitCity(event: ChangeEvent<HTMLSelectElement>){
        const citySelect = event.target.value;
        setSelectCity(citySelect);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;

        setFormData({...formData, [name]: value});
    }

    function handleSelectItem(id: number){
        const alreadyItems = itemsSelecteds.findIndex(item => item === id);

        if(alreadyItems >= 0){
            const filterItems = itemsSelecteds.filter(item => item !== id);

            setItemsSelecteds(filterItems);
        }else{
            setItemsSelecteds([...itemsSelecteds, id]); 
        }
    }

    async function HandleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectUf;
        const city = selectCity;
        const [ latitude, longitude ] = selectedPosition;
        const items = itemsSelecteds;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('point', data);

        alert('Ponto de coleta criado');
        history.push('/');
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={HandleSubmit}>
                <h1> Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onCLick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition}/>
                    </Map>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf"
                                id="uf"
                                value={selectUf}
                                onChange={handleSubmitUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}> {uf} </option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city"
                                id="city"
                                value={selectCity}
                                onChange={handleSubmitCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}> {city} </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                           <li 
                            key={item.id}
                            onClick={() => handleSelectItem(item.id)}
                            className={itemsSelecteds.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt="Teste"/>
                                <span> {item.title} </span>
                            </li> 
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}
 export default CreatePoint;
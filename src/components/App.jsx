import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { FormPhoneBook } from "./FormPhoneBook/FormPhoneBook";
import { ContactList } from "./ContactList/ContactList";
import { Filter } from "./Filter/Filter";
import { setFilter } from "redux/filterSlice";
import { fetchContacts,  addContact, deleteContact} from "services/api";
import { useEffect } from "react";

const BoxApp = styled.div`
  padding: 20px;
`;

export function App() {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contactsData.contacts.items);
  const filter = useSelector(state => state.filter.filter);
  const isLoading = useSelector(state => state.contactsData.contacts.isLoading);
  
  useEffect(() => {
    dispatch(fetchContacts());
  },[dispatch]);

  const handleSubmit = (value, {resetForm}) => {
    const { name, phone } = value;
    const contact = {
        name,
        phone,
    };

    if (isContact(name)) {
      alert(`${name} is alredy in contact.`);
      return;
    }

    dispatch(addContact(contact));
    resetForm();
  }
  
  const isContact = (name) => {
    const normalizeName = name.toLowerCase();
    return contacts.find(contact => contact.name.toLowerCase() === normalizeName);
  }

  const onChangeFilter = (e) => {
    dispatch(setFilter(e.currentTarget.value));
  }

  const getVisibleContacts = () => {
    const normalizeFilter = filter.toLowerCase();
    return contacts.filter(contact => contact.name.toLowerCase().includes(normalizeFilter));
  }

  const delContact = (id) => { 
    dispatch(deleteContact(id));
    return;
  }

    return (
    <BoxApp>
      <h2>Phonebook</h2>
        <FormPhoneBook handleSubmit={handleSubmit} />
          <h2>Contacts</h2>
        <Filter value={filter} onChange={onChangeFilter}/>
        {isLoading
          ? 'Loading, please wait...'
            : < ContactList listData={getVisibleContacts()} delContact={delContact} />}
    </BoxApp>
    );
}

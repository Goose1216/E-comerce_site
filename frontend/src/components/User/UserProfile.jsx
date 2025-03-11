import React, { useState, useEffect } from 'react'
import { getToken, removeToken } from '../../authStorage';
import axios from 'axios';
import styles from '../../styles/User/UserProfile.module.css';
import blockStyle from '../../styles/MainWindow/BlockStyle.module.css';

const UserProfileWindow = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone_number: '',
    email: '',
    first_name: '',
    last_name: '',
    username: '',
  });
  const [newData, setNewData] = useState({});

  const token = getToken();

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/dj-rest-auth/user/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data);
      setFormData({
        phone_number: response.data.phone_number || '',
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        username: response.data.username || '',
      });
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({
        ...newData,
        [name]: value,
    });
    setFormData({
        ...formData,
        [name]: value,
    })
  };

  const handleSave = async () => {
  try {
    await axios.patch('http://localhost:8000/api/v1/dj-rest-auth/user/', newData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    alert('Данные успешно обновлены!');
    fetchProfile();
  } catch (error) {
    if (error.response && error.response.data) {
      let errorMessage = 'Произошла ошибка при обновлении данных.';
      if (error.response.data.username) {
        errorMessage = error.response.data.username;
      }
      if (error.response.data.phone_number) {
        errorMessage = error.response.data.phone_number;
      }
      if (error.response.data.first_name) {
        errorMessage = error.response.data.first_name;
      }
      if (error.response.data.last_name) {
        errorMessage = error.response.data.last_name;
      }
       if (error.response.data.email) {
        errorMessage = error.response.data.email;
      }
      alert(errorMessage);
    } else {
      alert('Возникла непредвиденная ошибка при попытке обновления');
    }
    console.error('Ошибка при обновлении данных:', error);
  } finally {
      fetchProfile();
      setNewData({});
  }
};
  // Удаление профиля пока не работает, оно просто выходит из аккаунта
  const handleDeleteProfile = async () => {
    if (window.confirm('Вы уверены, что хотите удалить профиль?')) {
      try {
        await axios.delete('http://localhost:8000/api/v1/dj-rest-auth/user/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        alert('Профиль успешно удален.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } catch (error) {
         alert('Возникла непредвиденная ошибка при попытке удаления');
        console.error('Ошибка при удалении профиля:', error);
      }
    }
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = '/';
  };

  const handleChangePassword = () => {
    window.location.href = '/change-password';
  };

  if (loading) {
    return <div className={styles.errorMessage}> <span className={blockStyle.spinner}></span> </div>;
  }

  if (!user) {
    return <div className={styles.errorMessage} >Нет информации о пользователе</div>;
  }

  return (
  <div className={styles.Container}>
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={user.profile_image}
          alt="Фото профиля"
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h2 className={styles.username}>{user.username}</h2>
          <p className={styles.registrationDate}>
            Зарегистрирован: {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className={styles.profileForm}>
        <label>
          Номер телефона:
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Электронная почта:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly
          />
        </label>
        <label>
          Имя:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Фамилия:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Никнейм:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className={styles.profileActions}>
       <div className= {styles.leftButtons}>
            <button onClick={handleSave} className={styles.saveButton}>
              Сохранить изменения
            </button>
            <button onClick={handleChangePassword} className={styles.changePasswordButton}>
              Сменить пароль
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
       </div>
            <button onClick={handleDeleteProfile} className={styles.deleteButton}>
              Удалить профиль
            </button>
          </div>
    </div>
  </div>
  );
};

export default UserProfileWindow;
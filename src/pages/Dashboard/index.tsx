import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, isAfter } from 'date-fns';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Link } from 'react-router-dom';

import { FiClock, FiPower } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';

interface MonthAvailabiltyItem {
    day: number;
    available: boolean;
}

interface Appointment {
    id: string;
    date: string;
    formattedHour: string;
    user: {
        name: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [appointments, setAppointment] = useState<Appointment[]>([]);

    const [monthAvailability, setMonthAvailability] = useState<
        MonthAvailabiltyItem[]
    >([]);

    const { signOut, user } = useAuth();

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            },
        }).then(response => {
            setMonthAvailability(response.data);
        });
    }, [currentMonth, user.id]);

    const handleDateChange = useCallback(
        (day: Date, modifiers: DayModifiers) => {
            if (modifiers.available && !modifiers.disabled) {
                setSelectedDate(day);
            }
        },
        [],
    );

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter(monthDay => monthDay.available === false)
            .map(monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();

                return new Date(year, month, monthDay.day);
            });
        return dates;
    }, [currentMonth, monthAvailability]);

    useEffect(() => {
        api.get<Appointment[]>('/appointments/my-agenda', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            },
        }).then(response => {
            const formattedAppoointment = response.data.map(appointment => {
                return {
                    ...appointment,
                    formattedHour: format(parseISO(appointment.date), 'HH:mm'),
                };
            });
            setAppointment(formattedAppoointment);
        });
    }, [selectedDate]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, 'MMMM do');
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
        return format(selectedDate, 'cccc');
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    }, [appointments]);

    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    }, [appointments]);

    const nextAppointments = useMemo(() => {
        return appointments.find(appointment =>
            isAfter(parseISO(appointment.date), new Date()),
        );
    }, [appointments]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />
                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />
                        <div>
                            <span>Welcome</span>
                            <Link to="/profile">
                                <strong>{user.name}</strong>
                            </Link>
                        </div>
                    </Profile>
                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Agenda</h1>
                    <p>
                        {isToday(selectedDate) && <span>Today</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDay}</span>
                    </p>

                    {isToday(selectedDate) && nextAppointments && (
                        <NextAppointment>
                            <strong>Next Appointment</strong>
                            <div>
                                <img
                                    src={nextAppointments.user.avatar_url}
                                    alt={nextAppointments.user.name}
                                />

                                <strong>{nextAppointments.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointments.formattedHour}
                                </span>
                            </div>
                        </NextAppointment>
                    )}

                    <Section>
                        <strong>Morning</strong>

                        {morningAppointments.length === 0 && (
                            <p>There is no appointments for this morning!</p>
                        )}

                        {morningAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.formattedHour}
                                </span>
                                <div>
                                    <img
                                        src={appointment.user.avatar_url}
                                        alt={appointment.user.name}
                                    />

                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>

                    <Section>
                        <strong>Afternoon</strong>

                        {afternoonAppointments.length === 0 && (
                            <p>There is no appointments for this afternoon!</p>
                        )}

                        {afternoonAppointments.map(appointment => (
                            <Appointment key={appointment.id}>
                                <span>
                                    <FiClock />
                                    {appointment.formattedHour}
                                </span>
                                <div>
                                    <img
                                        src={appointment.user.avatar_url}
                                        alt={appointment.user.name}
                                    />

                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] },
                        }}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                    />
                </Calendar>
            </Content>
        </Container>
    );
};

export default Dashboard;

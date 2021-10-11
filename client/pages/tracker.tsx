import type { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, Col, FlexboxGrid, Loader, Panel, Table } from 'rsuite'
import apiHooks from '../api'
import actions from '../redux/actions'
import { AiFillStar } from 'react-icons/ai'
import { MdMood } from 'react-icons/md'
import { FaHamburger } from 'react-icons/fa'
import { RiMedicineBottleLine } from 'react-icons/ri'
import { BiWalk } from 'react-icons/bi'
import { AiFillIdcard } from 'react-icons/ai'
const Tracker: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const { data, error, loading } = apiHooks.useFetchDays(
    { userId: currentUser && currentUser.id },
    currentUser && currentUser.id ? true : false
  )
  error && console.error(error)
  data && console.log(data)

  return loading ? (
    <Loader backdrop center content="loading..." />
  ) : error ? (
    <p>Error</p>
  ) : (
    <>
      {data.days
        .sort((day1: any, day2: any) => day1.date - day2.date)
        .map((day: any) => (
          <Panel header={new Date(day.createdAt).toDateString()} collapsible bordered key={day.id}>
            <FlexboxGrid justify="space-evenly">
              <FlexboxGrid.Item colspan={8}>
                <AiFillIdcard /> ID: {day.id}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <AiFillIdcard /> User ID: {day.userId}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <AiFillStar /> Rating: {day.rating}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <MdMood /> Mood: {day.mood}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <FaHamburger /> Meals: {day.meals}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <RiMedicineBottleLine /> Meds: {day.meds.toString()}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}>
                <BiWalk /> Exercise: {day.exercise.toString()}
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8}></FlexboxGrid.Item>
            </FlexboxGrid>
          </Panel>
        ))}
    </>
  )
}

export default Tracker

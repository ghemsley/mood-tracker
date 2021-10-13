import type { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { Calendar, FlexboxGrid, List, Loader, Panel, Popover, Whisper } from 'rsuite'
import { AiFillStar } from 'react-icons/ai'
import { MdMood } from 'react-icons/md'
import { FaHamburger } from 'react-icons/fa'
import { RiMedicineBottleLine } from 'react-icons/ri'
import { BiWalk } from 'react-icons/bi'
import { CgArrowDownO } from 'react-icons/cg'
import apiHooks from '../api'

const CalendarPage: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const { data, error, loading } = apiHooks.useFetchDays(
    { userId: currentUser && currentUser.id },
    true
  )
  error && console.error(error)
  data && console.log(data)
  const renderCell = (date: Date) => {
    const iconSize = 20
    const currentDay = data.days.find((day: any) => {
      return new Date(day.createdAt).toDateString() === date.toDateString()
    })
    if (currentDay) {
      return (
        <Whisper
          trigger="click"
          placement="bottom"
          speaker={
            <Popover title={new Date(currentDay.createdAt).toLocaleDateString()}>
              {/* <AiFillIdcard /> ID: {currentDay.id}
            <AiFillIdcard /> User ID: {currentDay.userId} */}
              <List>
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AiFillStar size={iconSize} /> Rating: {currentDay.rating}
                  </div>
                </List.Item>
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MdMood size={iconSize} /> Mood: {currentDay.mood}
                  </div>
                </List.Item>
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaHamburger size={iconSize} /> Meals eaten: {currentDay.meals}
                  </div>
                </List.Item>
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RiMedicineBottleLine size={iconSize} /> Took meds:{' '}
                    {currentDay.meds ? 'yes' : 'no'}
                  </div>
                </List.Item>
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BiWalk size={iconSize} /> Exercised: {currentDay.exercise ? 'yes' : 'no'}
                  </div>
                </List.Item>
              </List>
            </Popover>
          }
        >
          <a>
            <p style={{ textAlign: 'center' }}>
              See info
              <br />
              <CgArrowDownO size={iconSize} />
            </p>
          </a>
        </Whisper>
      )
    } else return <></>
  }

  if (loading) {
    return <Loader size="lg" center content="loading..." />
  } else if (error) {
    return <p>Error</p>
  } else if (data && data.days.length === 0) {
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>There are no entries to display.</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  } else {
    return (
      <>
        <Panel header="Calendar" collapsible defaultExpanded bordered>
          <Calendar bordered renderCell={renderCell} />
        </Panel>
      </>
    )
  }
}

export default CalendarPage

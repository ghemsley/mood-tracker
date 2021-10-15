import type { NextPage } from 'next'
import { useSelector } from 'react-redux'
import { Calendar, FlexboxGrid, List, Loader, Panel, Popover, Whisper } from 'rsuite'
import { AiFillStar } from 'react-icons/ai'
import { MdMood } from 'react-icons/md'
import { FaHamburger } from 'react-icons/fa'
import { RiMedicineBottleLine } from 'react-icons/ri'
import { BiWalk } from 'react-icons/bi'
import { CgArrowDownO } from 'react-icons/cg'
import { GiWaterDrop } from 'react-icons/gi'
import { IoIosChatbubbles, IoMdJournal, IoIosMore } from 'react-icons/io'
import { MdVideogameAsset } from 'react-icons/md'
import { FunctionComponent } from 'react'
import { DayObject } from '../models/day'
import apiHooks from '../api'
import styles from '../styles/listItem.module.scss'

const ListItem: FunctionComponent = ({ children }) => (
  <div className={styles.listItem}>{children}</div>
)

const CalendarPage: NextPage = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const { data, error, loading } = apiHooks.useFetchDays(
    { userId: currentUser && currentUser.id },
    !!currentUser
  )
  error && console.error(error)
  data && console.log(data)
  const renderCell = (date: Date) => {
    const iconSize = 20
    const currentDay: DayObject | undefined =
      data &&
      data.days &&
      data.days.find((day: DayObject) => {
        return day && day.createdAt
          ? new Date(day.createdAt).toDateString() === date.toDateString()
          : false
      })
    if (currentDay) {
      return (
        <Whisper
          trigger="click"
          placement="bottom"
          speaker={
            <Popover title={new Date(currentDay.createdAt as number).toLocaleDateString()}>
              <List>
                {currentDay.rating && (
                  <List.Item>
                    <ListItem>
                      <AiFillStar size={iconSize} /> Rating: {currentDay.rating}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.journal && (
                  <Whisper
                    trigger="hover"
                    placement="right"
                    speaker={
                      <Popover title="Journal entry" visible>
                        <p>{currentDay.journal}</p>
                      </Popover>
                    }
                  >
                    <a>
                      <List.Item>
                        <ListItem>
                          <IoMdJournal size={iconSize} />
                          Journal entry:
                          <IoIosMore size={iconSize} />
                        </ListItem>
                      </List.Item>
                    </a>
                  </Whisper>
                )}
                {currentDay.mood && (
                  <List.Item>
                    <ListItem>
                      <MdMood size={iconSize} /> Mood: {currentDay.mood}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.meals && (
                  <List.Item>
                    <ListItem>
                      <FaHamburger size={iconSize} /> Meals eaten: {currentDay.meals}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.water && (
                  <List.Item>
                    <ListItem>
                      <GiWaterDrop size={iconSize} /> Hydration: {currentDay.water} cups
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.people && (
                  <List.Item>
                    <ListItem>
                      <IoIosChatbubbles size={iconSize} /> People talked to: {currentDay.people}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.activities && (
                  <List.Item>
                    <ListItem>
                      <MdVideogameAsset size={iconSize} /> Fun activities: {currentDay.water}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.meds && (
                  <List.Item>
                    <ListItem>
                      <RiMedicineBottleLine size={iconSize} /> Took meds:{' '}
                      {currentDay.meds ? 'yes' : 'no'}
                    </ListItem>
                  </List.Item>
                )}
                {currentDay.exercise && (
                  <List.Item>
                    <ListItem>
                      <BiWalk size={iconSize} /> Exercised: {currentDay.exercise ? 'yes' : 'no'}
                    </ListItem>
                  </List.Item>
                )}
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
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>{JSON.stringify(error)}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  } else if ((data && data.days.length === 0) || !data) {
    return (
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item colspan={100}>
          <p>There are no entries to display.</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  } else {
    return (
      <Panel header="Calendar" collapsible defaultExpanded bordered>
        <Calendar bordered renderCell={renderCell} />
      </Panel>
    )
  }
}

export default CalendarPage

import React from 'react'
import { IndexData } from '../Utilities/Algolia/IndexData'
import NavigationBar from '../Components/NavigationBar'
import { Card } from 'react-bootstrap'
import Search from '../Utilities/Algolia/Search'

export default function NewLyricSearch() {
  return (
    <>
        <IndexData />
        <NavigationBar />
        <Card>
            <h5>Search for lyrics</h5>
            <Card.Body>
                <div>
                    Search by lyric, song, or album to find your next favorite lyric
                </div>
                <div>
                    <Search />
                </div>
            </Card.Body>
        </Card>
    </>
  )
}

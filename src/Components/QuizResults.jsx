import { useCollection } from '@squidcloud/react';
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import FetchAlbumArtFromS3 from '../Utilities/FetchAlbumArt';

export default function QuizResults(props) {
  const { albumJourney } = props;
  const [loading, setLoading] = useState(true);
  
  const albumsCollection = useCollection('albums', 'postgres_id'); // Reference to albums collection in DB

  useEffect(() => {
    console.log('albumJourney: ', albumJourney);
  }, [albumJourney]);

  // Add zero score albums to albumJourney

  useEffect(() => {
      // GET ALBUM INFO
      const getAlbumInfo = async () => {
        try {

          const albumSnapshot = await albumsCollection
          .query()
          .dereference()
          .snapshot();

          let updatedAlbumJourney = [...albumJourney];
        
          for (const albumRow of albumSnapshot) {
            const {album_id, album_title, album_art_key, album_description } = albumRow;
            //console.log('albumRow: ', albumRow)
            // Fetch album art from S3
            const albumArtUrl = await FetchAlbumArtFromS3(album_art_key);

            const albumObject = { album_id: album_id, albumTitle: album_title, albumArtUrl: albumArtUrl, albumDescription: album_description };
            //console.log('albumObject: ', albumObject);
            // Add albumObject to albumJourney
              updatedAlbumJourney = updatedAlbumJourney.map(item => {
                if (item.album_id === albumObject.album_id) {
                    // Merge item and albumObject
                    return { ...item, ...albumObject };
                } else {
                    return item;
                }
            });
            console.log('updatedAlbumJourney: ', updatedAlbumJourney);
            // Update albumJourney state
            props.setAlbumJourney(updatedAlbumJourney);
            }
        setLoading(false);

        } catch (error) {
          console.error('Error fetching album info: ', error);
        }
    }
    getAlbumInfo();
        
  }, [])

  // TO DO: add links to album pages
  // TO DO: add album descriptions as <Card.Text>

if (loading) {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center'>
      <div>You're the only one of you</div>
      <div>Baby, that's the fun of you</div>
  </div>)
}

  return (
    <>
      <h3>Your Album Journey</h3>
       {albumJourney.map((album, index) => (
            <Card key={index}>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Card.Title>{album.albumTitle}</Card.Title>
                      <Card.Text>
                        {album.albumDescription}
                      </Card.Text>
                    </Col>
                    <Col md={4}>
                      <Card.Img 
                          variant="middle" 
                          src={album.albumArtUrl}
                          style={{ width: '200px', height: '200px' }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
            </Card>
        ))}
    </>
  )
}

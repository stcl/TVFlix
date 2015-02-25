from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    Text,
    ForeignKey,
    or_,
    and_
)

from ..models import Base, Session
from ..models.show_tag import Shows_Tag
from ..models.episode import Episode
from sqlalchemy.orm import relationship


class Show(Base):
    __tablename__ = "Shows"
    show_id = Column(Integer, primary_key=True)
    showlabel = Column(Unicode(100), nullable=False)
    title = Column(Unicode(100), nullable=False)
    start_year = Column(Integer, nullable=False)
    end_year = Column(Integer)
    bcast_day = Column(Integer)
    summary = Column(Text, nullable=False)
    channel = Column(Unicode(25), nullable=False)
    tags = relationship("Tag", secondary=Shows_Tag)
    episodes = relationship("Episode")
    comments = relationship("Comment")

    @classmethod
    def GetShowByLabel(cls, label):
        """
        This method will return a show using it's unique label. The label is a human-readable way to get a show.
        :param label: string
        :return: The show if exists else return None
        """
        try:
            return Session.query(Show).filter(Show.showlabel == label).one()
        except:
            return None

    @classmethod
    def SearchShowsByKeywords(cls, keywords):
        """
        Search for shows in the database using a string
        :param keywords: string
        :return: array
        """
        show = Session.query(Show).filter(or_(
                                    Show.title.like ('%'+ keywords +'%'),
                                    Show.start_year == keywords,
                                    Show.summary.like ('%'+ keywords +'%'),
                                    Show.channel.like ('%'+ keywords +'%')
                                    )).all()
                                    
        if show:
            return show       
        return None

    def GetEpisodes(self):
        """
        Return all the episodes for the Show

        :return: Array of Episode
        """
        if self.episodes:
            return self.episodes
        return None

    def GetEpisodeForSeason(self, season):
        """
        Get the episodes for the wanted season
        :param season: season number
        :return: Array of Episode
        """
                
        epi = Session.query(Episode).filter(and_(Episode.show_id == self.show_id, Episode.season == season)).all()
        if epi:
            return epi       
        return None

    def GetComments(self):
        """
        Get the comments made by the Users on the Show
        :return: Array of Comments
        """
        if self.comments:
            return self.comments
        return None
            
    def GetTags(self):
        """
        Get the tags associated with the Show
        :return: Array of Tags
        """
        if self.tags:
            return self.tags
        return None

    